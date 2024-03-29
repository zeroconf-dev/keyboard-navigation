import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import {
    assertNeverNonThrow,
    filterPropKeys,
    getTargetFocusKey,
    UnpackedHTMLElement,
    HTMLType,
} from '@zeroconf/keyboard-navigation/util';
import * as React from 'react';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    /**
     * Specify which intrinsic / host component the section should be rendered as.
     */
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;

    /**
     * Key of the boundary, similar to the `focusKey` of the `Focuser`, `Grid` and `Section`
     * **Note**: it most be unique within its enclosing boundary.
     */
    boundaryKey?: string;

    /**
     * Whether or not the tab boundary should cycle when attempting
     * to tab boyond the boundary.
     */
    cycle?: boolean;

    /**
     * Whether ot not to focus the first element if gaining focus
     * to the boundary from focus origin `next`.
     */
    focusFirstOnNextOrigin?: boolean;

    /**
     * When set to `true` and a child focuses the boundary,
     * the boundary will delegate focusing up the tree.
     *
     * This is useful when having a boundary that only
     * encloses other boundaries, then escaping an inner boundary
     * will cause the first child of the outer boundary to be focused
     * and thus cannot escape the outer boundary, enable this to mitigate that behavior.
     *
     * @example
     * <TabBoundary boundaryKey="outer" focusParentOnChildOrigin={true}>
     *   <Section focusKey="inner1" />
     *   <Section focusKey="inner2" />
     *   <Section focusKey="inner3" />
     * </TabBoundary>
     */
    focusParentOnChildOrigin?: boolean;

    /**
     * Set this to `true` to focus the parent of the boundary if exists
     * when hitting the escape key.
     *
     * @example
     * <TabBoundary boundaryKey="outer">
     *   <Focuser focusKey="editor-focuser" />
     *   <TabBoundary boundaryKey="editor" focusParentOnEscape={true}>
     *     <Focuser focusKey="editor-input1" />
     *     <Focuser focusKey="editor-input2" />
     *   </TabBoundary>
     * </TabBoundary>
     */
    focusParentOnEscape?: boolean;

    /**
     * Take a ref to the tab registry this boundary creates.
     */
    tabRegistryRef?: React.RefObject<TabRegistry>;
}

export type Props<TComp extends keyof JSX.IntrinsicElements = 'div'> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
> &
    ComponentProps<TComp>;

type PropsWithTabRegistry<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    parentRegistry: TabRegistry | null;
};

interface State {}

class TabBoundaryWithTabRegistry<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithTabRegistry<TComp> & { forwardedRef?: React.Ref<HTMLType<TComp>> },
    State
> {
    public static displayName = 'TabBoundary';

    private tabRegistry: TabRegistry;
    private ref: React.MutableRefObject<HTMLType<TComp> | null>;

    public constructor(props: PropsWithTabRegistry<TComp>) {
        super(props);
        this.tabRegistry = new TabRegistry({
            cycle: props.cycle,
            focusFirstOnNextOrigin: props.focusFirstOnNextOrigin,
            focusParentOnChildOrigin: props.focusParentOnChildOrigin,
        });

        this.ref = React.createRef();

        if (props.tabRegistryRef != null) {
            (props.tabRegistryRef as React.MutableRefObject<TabRegistry>).current = this.tabRegistry;
        }
    }

    public componentDidMount() {
        if (this.props.boundaryKey != null && this.props.parentRegistry != null) {
            this.props.parentRegistry.add(this.props.boundaryKey, this.tabRegistry);
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

    private filterPropKeys = (propKey: keyof ComponentProps<TComp> | 'parentRegistry' | 'forwardedRef') => {
        switch (propKey) {
            case 'as':
            case 'boundaryKey':
            case 'cycle':
            case 'focusFirstOnNextOrigin':
            case 'focusParentOnEscape':
            case 'focusParentOnChildOrigin':
            case 'forwardedRef':
            case 'parentRegistry':
            case 'tabRegistryRef':
                return false;
            default:
                assertNeverNonThrow(propKey);
                return true;
        }
    };

    private onKeyDown = (e: React.KeyboardEvent<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>) => {
        const targetFocusKey = getTargetFocusKey(e.target);
        if (e.key === 'Tab' && targetFocusKey != null && e.target !== this.ref.current) {
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                this.tabRegistry.focusPrev(targetFocusKey);
            } else {
                this.tabRegistry.focusNext(targetFocusKey);
            }
        } else if (e.key === 'Escape' && this.props.focusParentOnEscape) {
            e.preventDefault();
            e.stopPropagation();
            this.tabRegistry.focusParent();
        }

        if (this.props.onKeyDown != null) {
            this.props.onKeyDown(e);
        }
    };

    public UNSAFE_componentWillReceiveProps(nextProps: PropsWithTabRegistry<TComp>) {
        if (this.props.cycle !== nextProps.cycle) {
            nextProps.cycle ? this.tabRegistry.enableCycle() : this.tabRegistry.disableCycle();
        }

        if (this.props.focusParentOnChildOrigin !== nextProps.focusParentOnChildOrigin) {
            this.tabRegistry.focusParentOnChildOrigin = nextProps.focusParentOnChildOrigin === true;
        }

        if (this.props.focusFirstOnNextOrigin !== nextProps.focusFirstOnNextOrigin) {
            this.tabRegistry.focusFirstOnNextOrigin = nextProps.focusFirstOnNextOrigin === true;
        }

        if (
            this.props.boundaryKey !== nextProps.boundaryKey &&
            this.props.boundaryKey != null &&
            this.props.parentRegistry != null &&
            this.props.parentRegistry.has(this.props.boundaryKey)
        ) {
            this.props.parentRegistry.delete(this.props.boundaryKey);
        }
    }

    private setRef = (htmlRef: HTMLType<TComp> | null) => {
        this.ref.current = htmlRef;
        if (typeof this.props.forwardedRef === 'function') {
            this.props.forwardedRef(htmlRef);
        } else if (this.props.forwardedRef != null && this.props.forwardedRef.hasOwnProperty('current')) {
            (this.props.forwardedRef as React.MutableRefObject<HTMLType<TComp> | null>).current = htmlRef;
        }
    };

    public render() {
        const props = filterPropKeys<ComponentProps<TComp>, TComp, PropsWithTabRegistry<TComp>>(
            this.props,
            this.filterPropKeys,
        );

        const comp = this.props.as == null ? 'div' : this.props.as;
        const children = React.createElement(
            comp,
            { ...props, onKeyDown: this.onKeyDown, ref: this.setRef },
            this.props.children,
        );

        return <NavigationContext.Provider value={this.tabRegistry}>{children}</NavigationContext.Provider>;
    }
}

type PropsWithForwardRef<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    forwardedRef?: React.Ref<HTMLType<TComp>>;
};
class TabBoundaryWithForwardRef<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithForwardRef<TComp>
> {
    public static displayName = 'TabRegistry(TabBoundary)';

    private renderChildren = (parentRegistry: TabRegistry | null) => {
        return <TabBoundaryWithTabRegistry {...this.props} parentRegistry={parentRegistry} />;
    };

    public render() {
        return <NavigationContext.Consumer children={this.renderChildren} />;
    }
}

/**
 * Define a tab/navigation boundary of focusable elements.
 * This is a primitive way of grouping focusables.
 *
 * @example Simple
 * <TabBoundary>
 *   <Focuser focusKey="field1" />
 * </TabBoundary>
 *
 * @example Nested boundary
 * <TabBoundary>
 *   <TabBoundary focusKey="sidebar">
 *     <Focuser focusKey="menu-link1" />
 *     <Focuser focusKey="menu-link2" />
 *   </TabBoundary>
 *   <TabBoundary focusKey="main-content">
 *      <Focuser focusKey="search-bar" />
 *      <Focuser focusKey="some-other-element" />
 *   </TabBoundary>
 * </TabBoundary>
 */
export const TabBoundary = React.forwardRef(
    <TComp extends keyof JSX.IntrinsicElements = 'div'>(props: Props<TComp>, ref: React.Ref<HTMLType<TComp>>) => (
        <TabBoundaryWithForwardRef<TComp> {...props} forwardedRef={ref} />
    ),
);
