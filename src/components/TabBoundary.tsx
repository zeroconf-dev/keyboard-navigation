import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLElement } from '../util';

function hasNameProperty<T>(obj: T): obj is T & { name: string } {
    return obj != null && typeof (obj as any).name === 'string';
}

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    boundaryKey?: string;
    cycle?: boolean;
    focusParentOnChildOrigin?: boolean;
    focusParentOnEscape?: boolean;
}

type TabBoundaryProps<TComp extends keyof JSX.IntrinsicElements> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
> &
    ComponentProps<TComp>;

export const NavigationContext = React.createContext<TabRegistry | null>(null);

export class TabBoundary<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    TabBoundaryProps<TComp>
> {
    private parentRegistry: TabRegistry<string> | null = null;
    private tabRegistry: TabRegistry<string>;

    public constructor(props: TabBoundaryProps<TComp>) {
        super(props);

        this.tabRegistry = new TabRegistry({
            cycle: props.cycle,
            focusParentOnChildOrigin: props.focusParentOnChildOrigin,
        });
    }

    public componentWillReceiveProps(nextProps: TabBoundaryProps<TComp>) {
        if (this.props.cycle !== nextProps.cycle) {
            nextProps.cycle ? this.tabRegistry.enableCycle() : this.tabRegistry.disableCycle();
        }

        if (this.props.focusParentOnChildOrigin !== nextProps.focusParentOnChildOrigin) {
            this.tabRegistry.focusParentOnChildOrigin = nextProps.focusParentOnChildOrigin === true;
        }

        const parentRegistry = this.parentRegistry;
        if (parentRegistry != null) {
            if (this.props.boundaryKey !== nextProps.boundaryKey) {
                if (this.props.boundaryKey != null) {
                    parentRegistry.delete(this.props.boundaryKey);
                }
                if (nextProps.boundaryKey != null) {
                    parentRegistry.add(nextProps.boundaryKey, this.tabRegistry);
                }
            }
        }
    }

    public componentWillUnmount() {
        const parentRegistry = this.parentRegistry;
        if (parentRegistry != null && this.props.boundaryKey != null) {
            parentRegistry.delete(this.props.boundaryKey);
        }
        this.parentRegistry = null;
    }

    private filterPropKeys = (propKey: keyof ComponentProps<TComp>) => {
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
                this.tabRegistry.focusPrev(e.target.name);
            } else {
                this.tabRegistry.focusNext(e.target.name);
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

    private renderWithTabRegistry = (newParentRegistry: TabRegistry<string> | null) => {
        const props = filterPropKeys<ComponentProps<TComp>, TComp, TabBoundaryProps<TComp>>(
            this.props,
            this.filterPropKeys,
        );

        const comp = this.props.as == null ? 'div' : this.props.as;
        const oldParentRegistry = this.parentRegistry;

        const children = React.createElement(comp, { ...props, onKeyDown: this.onKeyDown }, this.props.children);
        if (this.props.boundaryKey != null && oldParentRegistry !== newParentRegistry) {
            if (oldParentRegistry != null) {
                oldParentRegistry.delete(this.props.boundaryKey);
            }
            if (newParentRegistry != null) {
                newParentRegistry.add(this.props.boundaryKey, this.tabRegistry);
            }
        }

        this.parentRegistry = newParentRegistry || null;

        return <NavigationContext.Provider value={this.tabRegistry}>{children}</NavigationContext.Provider>;
    };

    public render() {
        return <NavigationContext.Consumer>{this.renderWithTabRegistry}</NavigationContext.Consumer>;
    }
}
