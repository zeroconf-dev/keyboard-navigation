import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { HotkeyEvent } from '@zeroconf/keyboard-navigation/hooks';
import { useFocusable } from '@zeroconf/keyboard-navigation/hooks/useFocusable';
import { useNewTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useNewTabRegistry';
import { HotkeyContextProvider } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyContext';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyPublicScope, HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import {
    assertNeverNonThrow,
    filterPropKeys,
    getTargetFocusKey,
    UnpackedHTMLElement,
} from '@zeroconf/keyboard-navigation/util';
import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';

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

    crossGlobalBoundary: boolean;
    crossLocalBoundary: boolean;

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

    scope: HotkeyPublicScope;

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
        case 'crossGlobalBoundary':
        case 'crossLocalBoundary':
        case 'cycle':
        case 'focusFirstOnNextOrigin':
        case 'focusParentOnEscape':
        case 'focusParentOnChildOrigin':
        case 'scope':
        case 'tabRegistryRef':
            return false;
        default:
            assertNeverNonThrow(propKey);
            return true;
    }
};

export const TabBoundary = <TComp extends keyof JSX.IntrinsicElements>(props: Props<TComp>) => {
    const { crossGlobalBoundary, crossLocalBoundary, scope } = props;
    const parentRegistry = useHotkeyRegistry();
    const registry = useMemo(
        () =>
            HotkeyRegistry.for(parentRegistry, scope, {
                crossGlobalBoundary,
                crossLocalBoundary,
            }),
        [scope, parentRegistry, crossGlobalBoundary, crossLocalBoundary],
    );
    useEffect(() => () => registry.dispose(), [registry]);

    const tabRegistry = useNewTabRegistry(props) as TabRegistry<string>;
    useFocusable(props.boundaryKey, tabRegistry);

    const childProps = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(props, filterProps);

    useEffect(() => {
        const hotkeyIds = registry.addAll({
            esc: props.focusParentOnEscape ? () => tabRegistry.focusParent() : null,
            'shift+tab': (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey(e);
                return focusKey == null ? false : tabRegistry.focusPrev(focusKey);
            },
            tab: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey(e);
                return focusKey == null ? false : tabRegistry.focusNext(focusKey);
            },
        });
        return () => registry.removeAll(hotkeyIds);
    }, [tabRegistry, registry, props.focusParentOnEscape]);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            registry.runCurrent(e);
        },
        [registry],
    );

    const comp = props.as == null ? 'div' : props.as;
    const children = React.createElement(comp, { ...childProps, onKeyDown }, props.children);

    return (
        <HotkeyContextProvider value={registry}>
            <NavigationContext.Provider children={children} value={tabRegistry} />
        </HotkeyContextProvider>
    );
};