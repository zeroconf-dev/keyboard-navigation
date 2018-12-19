import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLElement } from '../util';

function hasNameProperty<T>(obj: T): obj is T & { name: string } {
    return obj != null && typeof (obj as any).name === 'string';
}

export const NavigationContext = React.createContext<TabRegistry | null>(null);

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    boundaryKey?: string;
    cycle?: boolean;
    focusParentOnChildOrigin?: boolean;
    focusParentOnEscape?: boolean;
}

type Props<TComp extends keyof JSX.IntrinsicElements = 'div'> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
> &
    ComponentProps<TComp>;

interface State {}

type PropsWithTabRegistry<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    parentRegistry: TabRegistry | null;
};

class TabBoundaryWithTabRegistry<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithTabRegistry<TComp>,
    State
> {
    public static displayName = 'TabBoundary';

    private tabRegistry: TabRegistry<string>;

    public constructor(props: PropsWithTabRegistry<TComp>) {
        super(props);

        this.tabRegistry = new TabRegistry({
            cycle: props.cycle,
            focusParentOnChildOrigin: props.focusParentOnChildOrigin,
        });
    }

    public componentDidMount() {
        if (this.props.boundaryKey != null && this.props.parentRegistry != null) {
            this.props.parentRegistry.add(this.props.boundaryKey, this.tabRegistry);
        }
    }

    public componentWillReceiveProps(nextProps: PropsWithTabRegistry<TComp>) {
        if (this.props.cycle !== nextProps.cycle) {
            nextProps.cycle ? this.tabRegistry.enableCycle() : this.tabRegistry.disableCycle();
        }

        if (this.props.focusParentOnChildOrigin !== nextProps.focusParentOnChildOrigin) {
            this.tabRegistry.focusParentOnChildOrigin = nextProps.focusParentOnChildOrigin === true;
        }

        if (
            this.props.boundaryKey !== nextProps.boundaryKey &&
            this.props.parentRegistry != null &&
            this.props.parentRegistry.has(this.props.boundaryKey)
        ) {
            this.props.parentRegistry.delete(this.props.boundaryKey);
        }
    }

    public componentDidUpdate(prevProps: PropsWithTabRegistry<TComp>) {
        if (
            this.props.boundaryKey !== prevProps.boundaryKey &&
            this.props.parentRegistry != null &&
            this.props.boundaryKey != null
        ) {
            this.props.parentRegistry.add(this.props.boundaryKey, this.tabRegistry);
        }
    }

    public componentWillUnmount() {
        if (this.props.boundaryKey != null && this.props.parentRegistry != null) {
            this.props.parentRegistry.delete(this.props.boundaryKey);
        }
    }

    private filterPropKeys = (propKey: (keyof ComponentProps<TComp>) | 'parentRegistry') => {
        switch (propKey) {
            case 'as':
            case 'boundaryKey':
            case 'cycle':
            case 'focusParentOnEscape':
            case 'focusParentOnChildOrigin':
            case 'parentRegistry':
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

    public render() {
        const props = filterPropKeys<ComponentProps<TComp>, TComp, PropsWithTabRegistry<TComp>>(
            this.props,
            this.filterPropKeys,
        );

        const comp = this.props.as == null ? 'div' : this.props.as;
        const children = React.createElement(comp, { ...props, onKeyDown: this.onKeyDown }, this.props.children);

        return <NavigationContext.Provider value={this.tabRegistry}>{children}</NavigationContext.Provider>;
    }
}

type PropsWithForwardRef<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    forwardedRef?: React.Ref<TabBoundaryWithTabRegistry<TComp>>;
};
class TabBoundaryWithForwardRef<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithForwardRef<TComp>
> {
    public static displayName = 'TabRegistry(TabBoundary)';

    private renderChildren = (parentRegistry: TabRegistry | null) => {
        const { forwardedRef, ...props } = this.props;
        return <TabBoundaryWithTabRegistry {...props} parentRegistry={parentRegistry} ref={forwardedRef} />;
    };

    public render() {
        return <NavigationContext.Consumer children={this.renderChildren} />;
    }
}

const forwardRef = <TComp extends keyof JSX.IntrinsicElements = 'div'>() =>
    React.forwardRef<TabBoundaryWithTabRegistry<TComp>, Props<TComp>>((props, ref) => (
        <TabBoundaryWithForwardRef {...props} forwardedRef={ref} />
    ));

export type TabBoundary = TabBoundaryWithTabRegistry;
export const TabBoundary = forwardRef<keyof JSX.IntrinsicElements>();
