import * as React from 'react';
import { NavigationContext } from '../../components/NavigationContext';
import { TabRegistry } from '../../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLElement } from '../../util';
import { useFocusable } from '../useFocusable';
import { useNewTabRegistry } from '../useNewTabRegistry';

function hasNameProperty<T>(obj: T): obj is T & { name: string } {
    return obj != null && typeof (obj as any).name === 'string';
}

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

const filterProps = <TComp extends keyof JSX.IntrinsicElements>(propKey: keyof ComponentProps<TComp>) => {
    switch (propKey) {
        case 'as':
        case 'boundaryKey':
        case 'cycle':
        case 'focusFirstOnNextOrigin':
        case 'focusParentOnEscape':
        case 'focusParentOnChildOrigin':
        case 'tabRegistryRef':
            return false;
        default:
            assertNeverNonThrow(propKey);
            return true;
    }
};

export const TabBoundary = <TComp extends keyof JSX.IntrinsicElements>(props: Props<TComp>) => {
    const tabRegistry = useNewTabRegistry(props);
    useFocusable(props.boundaryKey, tabRegistry);

    const childProps = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(props, filterProps);

    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>) => {
            if (e.key === 'Tab' && hasNameProperty(e.target)) {
                e.preventDefault();
                e.stopPropagation();

                if (e.shiftKey) {
                    tabRegistry.focusPrev(e.target.name);
                } else {
                    tabRegistry.focusNext(e.target.name);
                }
            } else if (e.key === 'Escape' && props.focusParentOnEscape) {
                e.preventDefault();
                e.stopPropagation();
                tabRegistry.focusParent();
            }

            if (props.onKeyDown != null) {
                props.onKeyDown(e);
            }
        },
        [tabRegistry, props.onKeyDown, props.focusParentOnEscape],
    );

    const comp = props.as == null ? 'div' : props.as;
    const children = React.createElement(comp, { ...childProps, onKeyDown }, props.children);

    return <NavigationContext.Provider children={children} value={tabRegistry} />;
};
