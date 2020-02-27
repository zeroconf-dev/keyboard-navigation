import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { useFocusable } from '@zeroconf/keyboard-navigation/hooks/useFocusable';
import { useNewTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useNewTabRegistry';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import {
    assertNeverNonThrow,
    filterPropKeys,
    getTargetFocusKey,
    UnpackedHTMLElement,
} from '@zeroconf/keyboard-navigation/util';
import React, { useCallback, useMemo } from 'react';
import { NavigationFieldMap, createNavigationHandler } from '@zeroconf/keyboard-navigation/FieldNavigation';
import { ModifierKeys } from '@zeroconf/keyboard-navigation/hooks/components/Focuser';

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
     * Map focus key location map, describing the
     * visual physical location between one and nother.
     */
    navigationMap?: NavigationFieldMap;

    tabDirectionAxis?: 'x' | 'y';

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
        case 'navigationMap':
        case 'tabDirectionAxis':
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

    const navigationHandler = useMemo(() => {
        return props.navigationMap == null
            ? null
            : createNavigationHandler(props.navigationMap, tabRegistry, props.tabDirectionAxis);
    }, [tabRegistry, props.navigationMap, props.tabDirectionAxis]);

    const childProps = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(props, filterProps);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>) => {
            const focusKey = getTargetFocusKey(e.target);
            let shouldPrevent = false;
            const modifierKeys: ModifierKeys = {
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey,
            };

            if (e.key === 'ArrowUp' && focusKey != null && navigationHandler != null) {
                shouldPrevent = true;
                navigationHandler(focusKey, 'ArrowUp', modifierKeys);
            } else if (e.key === 'ArrowDown' && focusKey != null && navigationHandler != null) {
                shouldPrevent = true;
                navigationHandler(focusKey, 'ArrowDown', modifierKeys);
            } else if (e.key === 'ArrowLeft' && focusKey != null && navigationHandler != null) {
                shouldPrevent = true;
                navigationHandler(focusKey, 'ArrowLeft', modifierKeys);
            } else if (e.key === 'ArrowRight' && focusKey != null && navigationHandler != null) {
                shouldPrevent = true;
                navigationHandler(focusKey, 'ArrowRight', modifierKeys);
            } else if (e.key === 'Tab' && focusKey != null) {
                shouldPrevent = true;
                if (navigationHandler == null) {
                    if (e.shiftKey) {
                        tabRegistry.focusPrev(focusKey);
                    } else {
                        tabRegistry.focusNext(focusKey);
                    }
                } else {
                    navigationHandler(focusKey, 'Tab', modifierKeys);
                }
            } else if (e.key === 'Escape' && props.focusParentOnEscape) {
                shouldPrevent = true;
                tabRegistry.focusParent();
            }

            if (shouldPrevent) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (props.onKeyDown != null) {
                props.onKeyDown(e);
            }
        },
        [tabRegistry, props.onKeyDown, props.focusParentOnEscape, navigationHandler],
    );

    const comp = props.as == null ? 'div' : props.as;
    const children = React.createElement(
        comp,
        { ...childProps, onKeyDown },
        typeof props.children === 'function' ? props.children(navigationHandler) : props.children,
    );

    return <NavigationContext.Provider children={children} value={tabRegistry} />;
};
