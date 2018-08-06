import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TabRegistry } from '../TabRegistry';

function hasNameProperty<T>(obj: T): obj is T & { name: string } {
    return obj != null && typeof (obj as any).name === 'string';
}

function stringToKey<TKey extends string | number>(str: string): TKey {
    const numValue = Number(str);
    return Number.isNaN(numValue) || String(numValue) !== str ? (numValue as TKey) : (str as TKey);
}

function assertNever(obj: never): never {
    return obj;
}

interface ComponentProps<TKey extends number | string, TComp extends keyof JSX.IntrinsicElements> {
    boundaryKey?: TKey;
    component?: TComp;
    cycle?: boolean;
    focusParentOnChildOrigin?: boolean;
    focusParentOnEscape?: boolean;
}

type TabBoundaryProps<
    TKey extends number | string,
    TComp extends keyof JSX.IntrinsicElements
> = JSX.IntrinsicElements[TComp] & ComponentProps<TKey, TComp>;

export interface TabBoundaryContext<TKey extends number | string> {
    tabRegistry?: TabRegistry<TKey>;
}

interface TabBoundaryState {}

export class TabBoundary<
    TKey extends number | string,
    TComp extends keyof JSX.IntrinsicElements
> extends React.Component<TabBoundaryProps<TKey, TComp>, TabBoundaryState> {
    public static childContextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    public static contextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    private tabRegistry: TabRegistry<TKey>;

    public context!: TabBoundaryContext<TKey>;
    public props!: TabBoundaryProps<TKey, TComp>;

    public constructor(props: TabBoundaryProps<TKey, TComp>, context?: TabBoundaryContext<TKey>) {
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

    public componentWillReceiveProps(nextProps: TabBoundaryProps<TKey, TComp>) {
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

    private onKeyDown: JSX.IntrinsicElements[TComp]['onKeyDown'] = (e: React.KeyboardEvent<any>) => {
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
        const component = this.props.component;
        const propKeys = Object.keys(this.props) as (keyof TabBoundaryProps<TKey, TComp>)[];
        const props = propKeys
            .filter((propKey: keyof TabBoundaryProps<TKey, TComp>) => {
                const boundaryProp = propKey as keyof ComponentProps<TKey, TComp>;
                switch (boundaryProp) {
                    case 'boundaryKey':
                    case 'component':
                    case 'cycle':
                    case 'focusParentOnEscape':
                    case 'focusParentOnChildOrigin':
                        return false;
                    default:
                        assertNever(boundaryProp);
                        return true;
                }
            })
            .reduce(
                (carry: JSX.IntrinsicElements[TComp], propKey: keyof TabBoundaryProps<TKey, TComp>) => {
                    const intrinsicProp = propKey as keyof JSX.IntrinsicElements[TComp];
                    carry[intrinsicProp] = this.props[intrinsicProp];
                    return carry;
                },
                {} as JSX.IntrinsicElements[TComp],
            );

        const Comp: TComp = component == null ? ('div' as TComp) : (component as TComp);
        return React.createElement(Comp, Object.assign({}, props, { onKeyDown: this.onKeyDown }), this.props.children);
    }
}
