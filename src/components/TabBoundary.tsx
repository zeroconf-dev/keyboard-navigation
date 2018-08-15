import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLElement } from '../util';

function hasNameProperty<T>(obj: T): obj is T & { name: string } {
    return obj != null && typeof (obj as any).name === 'string';
}

function stringToKey<TKey extends string | number>(str: string): TKey {
    const numValue = Number(str);
    return Number.isNaN(numValue) || String(numValue) !== str ? (numValue as TKey) : (str as TKey);
}

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> {
    boundaryKey?: TKey;
    component?: TComp;
    cycle?: boolean;
    focusParentOnChildOrigin?: boolean;
    focusParentOnEscape?: boolean;
}

type TabBoundaryProps<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
> &
    ComponentProps<TComp, TKey>;

export interface TabBoundaryContext<TKey extends number | string> {
    tabRegistry?: TabRegistry<TKey>;
}

interface TabBoundaryState {}

export class TabBoundary<
    TComp extends keyof JSX.IntrinsicElements = 'div',
    TKey extends number | string = string
> extends React.Component<TabBoundaryProps<TComp, TKey>, TabBoundaryState> {
    public static childContextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    public static contextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    private tabRegistry: TabRegistry<TKey>;

    public context!: TabBoundaryContext<TKey>;
    public props!: TabBoundaryProps<TComp, TKey>;

    public constructor(props: TabBoundaryProps<TComp, TKey>, context?: TabBoundaryContext<TKey>) {
        super(props, context);
        this.tabRegistry = new TabRegistry({
            cycle: props.cycle,
            focusParentOnChildOrigin: props.focusParentOnChildOrigin,
        });
    }

    public componentDidMount() {
        if (this.context.tabRegistry != null && this.props.boundaryKey != null) {
            this.context.tabRegistry.add(this.props.boundaryKey, this.tabRegistry);
        }
    }

    public componentWillReceiveProps(nextProps: TabBoundaryProps<TComp, TKey>) {
        const tabRegistry = this.context == null ? null : this.context.tabRegistry;
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
        if (this.context.tabRegistry != null && this.props.boundaryKey != null) {
            this.context.tabRegistry.delete(this.props.boundaryKey);
        }
    }

    private filterPropKeys = (propKey: keyof ComponentProps<TComp, TKey>) => {
        switch (propKey) {
            case 'boundaryKey':
            case 'component':
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

    public getChildContext() {
        return {
            tabRegistry: this.tabRegistry,
        };
    }

    public render() {
        const props = filterPropKeys<ComponentProps<TComp, TKey>, TComp, TabBoundaryProps<TComp, TKey>>(
            this.props,
            this.filterPropKeys,
        );

        const comp = this.props.component == null ? 'div' : this.props.component;

        return React.createElement(
            comp,
            {
                ...props,
                onKeyDown: this.onKeyDown,
            },
            this.props.children,
        );
    }
}
