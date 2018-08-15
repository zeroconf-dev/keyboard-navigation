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

interface ComponentProps<TKey extends number | string> {
    boundaryKey?: TKey;
    cycle?: boolean;
    focusParentOnChildOrigin?: boolean;
    focusParentOnEscape?: boolean;
}

type TabBoundaryProps<TKey extends number | string> = React.HTMLAttributes<HTMLDivElement> & ComponentProps<TKey>;

export interface TabBoundaryContext<TKey extends number | string> {
    tabRegistry?: TabRegistry<TKey>;
}

interface TabBoundaryState {}

export class TabBoundary<TKey extends number | string = string> extends React.Component<
    TabBoundaryProps<TKey>,
    TabBoundaryState
> {
    public static childContextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    public static contextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    private tabRegistry: TabRegistry<TKey>;

    public context!: TabBoundaryContext<TKey>;
    public props!: TabBoundaryProps<TKey>;

    public constructor(props: TabBoundaryProps<TKey>, context?: TabBoundaryContext<TKey>) {
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

    public componentWillReceiveProps(nextProps: TabBoundaryProps<TKey>) {
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
        const propKeys = Object.keys(this.props) as (keyof TabBoundaryProps<TKey>)[];
        const props = propKeys
            .filter((propKey: keyof TabBoundaryProps<TKey>) => {
                const boundaryProp = propKey as keyof ComponentProps<TKey>;
                switch (boundaryProp) {
                    case 'boundaryKey':
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
                (carry: React.HTMLAttributes<HTMLDivElement>, propKey: keyof TabBoundaryProps<TKey>) => {
                    const intrinsicProp = propKey as keyof React.HTMLAttributes<HTMLDivElement>;
                    carry[intrinsicProp] = this.props[intrinsicProp];
                    return carry;
                },
                {} as React.HTMLAttributes<HTMLDivElement>,
            );

        return (
            <div {...props} onKeyDown={this.onKeyDown}>
                {this.props.children}
            </div>
        );
    }
}
