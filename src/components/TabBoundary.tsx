import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLElement } from '../util';

function hasNameProperty<T>(obj: T): obj is T & { name: string } {
    return obj != null && typeof (obj as any).name === 'string';
}

function stringToKey<TKey extends string | number>(str: string): TKey {
    const numValue = Number(str);
    return (Number.isNaN(numValue) || String(numValue) !== str ? str : numValue) as TKey;
}

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    boundaryKey?: TKey;
    cycle?: boolean;
    focusParentOnChildOrigin?: boolean;
    focusParentOnEscape?: boolean;
}

type TabBoundaryProps<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
> &
    ComponentProps<TComp, TKey>;

export const NavigationContext = React.createContext<TabRegistry | null>(null);

export class TabBoundary<
    TComp extends keyof JSX.IntrinsicElements = 'div',
    TKey extends number | string = string
> extends React.Component<TabBoundaryProps<TComp, TKey>> {
    private parentRegistry: TabRegistry<TKey> | null = null;
    private tabRegistry: TabRegistry<TKey>;

    public constructor(props: TabBoundaryProps<TComp, TKey>) {
        super(props);

        this.tabRegistry = new TabRegistry({
            cycle: props.cycle,
            focusParentOnChildOrigin: props.focusParentOnChildOrigin,
        });
    }

    public componentWillReceiveProps(nextProps: TabBoundaryProps<TComp, TKey>) {
        const tabRegistry = this.parentRegistry;
        if (tabRegistry != null) {
            if (this.props.cycle !== nextProps.cycle) {
                nextProps.cycle ? tabRegistry.enableCycle() : tabRegistry.disableCycle();
            }

            if (this.props.focusParentOnChildOrigin !== nextProps.focusParentOnChildOrigin) {
                tabRegistry.focusParentOnChildOrigin = nextProps.focusParentOnChildOrigin === true;
            }

            if (this.props.boundaryKey !== nextProps.boundaryKey) {
                if (this.props.boundaryKey != null) {
                    tabRegistry.delete(this.props.boundaryKey);
                }
                if (nextProps.boundaryKey != null) {
                    tabRegistry.add(nextProps.boundaryKey, this.tabRegistry);
                }
            }
        }
    }

    public componentWillUnmount() {
        if (this.parentRegistry != null) {
            if (this.props.boundaryKey != null) {
                this.parentRegistry.delete(this.props.boundaryKey);
            }
            this.parentRegistry = null;
        }
    }

    private filterPropKeys = (propKey: keyof ComponentProps<TComp, TKey>) => {
        switch (propKey) {
            case 'as':
            case 'boundaryKey':
            case 'cycle':
            case 'focusParentOnEscape':
            case 'focusParentOnChildOrigin':
                return false;
            default:
                assertNeverNonThrow(propKey);
                return true;
        }
    };

    private onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Tab' && hasNameProperty(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                this.tabRegistry.focusPrev(stringToKey(e.target.name));
            } else {
                this.tabRegistry.focusNext(stringToKey(e.target.name));
            }
        } else if (e.key === 'Escape' && this.props.focusParentOnEscape) {
            e.preventDefault();
            e.stopPropagation();
            this.tabRegistry.focusParent();
        }

        if (this.props.onKeyDown != null) {
            (this.props as any).onKeyDown(e);
        }
    };

    public render() {
        const props = filterPropKeys<ComponentProps<TComp, TKey>, TComp, TabBoundaryProps<TComp, TKey>>(
            this.props,
            this.filterPropKeys,
        );

        const comp = this.props.as == null ? 'div' : this.props.as;

        const children = React.createElement(
            comp,
            {
                ...props,
                onKeyDown: this.onKeyDown,
            },
            this.props.children,
        );

        return (
            <NavigationContext.Consumer>
                {tabRegistry => {
                    if (this.parentRegistry != null && this.props.boundaryKey != null && tabRegistry !== tabRegistry) {
                        this.parentRegistry.delete(this.props.boundaryKey);
                    }
                    if (tabRegistry != null && this.props.boundaryKey != null) {
                        tabRegistry.add(this.props.boundaryKey, this.tabRegistry);
                    }

                    this.parentRegistry = tabRegistry || null;

                    return <NavigationContext.Provider value={this.tabRegistry}>{children}</NavigationContext.Provider>;
                }}
            </NavigationContext.Consumer>
        );
    }
}
