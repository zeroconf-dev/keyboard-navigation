import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { useFocusable } from '@zeroconf/keyboard-navigation/hooks/useFocusable';
import { useNewTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useNewTabRegistry';
import { HotkeyContextProvider } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyContext';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { scopes, HotkeyPublicScope, HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import {
    assertNeverNonThrow,
    filterPropKeys,
    ForwardRefComponent,
    ForwardRefProps,
    HTMLType,
    UnpackedHTMLElement,
} from '@zeroconf/keyboard-navigation/util';
import React, { forwardRef, useCallback, useEffect, useMemo } from 'react';

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

    crossGlobalBoundary?: boolean;
    crossLocalBoundary?: boolean;

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

    hotkeyRegistryRef?: React.RefObject<HotkeyRegistry>;

    scope?: HotkeyPublicScope;

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
        case 'hotkeyRegistryRef':
        case 'scope':
        case 'tabRegistryRef':
            return false;
        default:
            assertNeverNonThrow(propKey);
            return true;
    }
};

export const TabBoundary = forwardRef(
    <TComp extends keyof JSX.IntrinsicElements = 'div'>(
        props: React.PropsWithChildren<Props<TComp>>,
        ref?: React.Ref<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>,
    ) => {
        const { crossGlobalBoundary, crossLocalBoundary, hotkeyRegistryRef, scope } = props;
        const parentRegistry = useHotkeyRegistry();
        const registry = useMemo(
            () =>
                HotkeyRegistry.for(parentRegistry, scope, {
                    crossGlobalBoundary,
                    crossLocalBoundary,
                }),
            [scope, parentRegistry, crossGlobalBoundary, crossLocalBoundary],
        );
        useEffect(() => {
            if (hotkeyRegistryRef != null) {
                (hotkeyRegistryRef as React.MutableRefObject<HotkeyRegistry | null>).current = registry;
                return () => {
                    (hotkeyRegistryRef as React.MutableRefObject<HotkeyRegistry | null>).current = null;
                };
            }
            return;
        }, [registry, hotkeyRegistryRef]);
        useEffect(() => () => registry.dispose(), [registry]);

        const tabRegistry = useNewTabRegistry(props) as TabRegistry;
        useFocusable(props.boundaryKey, tabRegistry);

        const childProps = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(props, filterProps);

        useEffect(() => {
            const hotkeyIds = registry.addAll({
                tab: (focusKey: string | null) => {
                    return focusKey == null ? false : tabRegistry.focusNext(focusKey);
                },
                'shift+tab': (focusKey: string | null) => {
                    return focusKey == null ? false : tabRegistry.focusPrev(focusKey);
                },
                esc: props.focusParentOnEscape ? () => tabRegistry.focusParent() : null,
            });
            return () => registry.removeAll(hotkeyIds);
        }, [tabRegistry, registry, props.focusParentOnEscape]);

        const onKeyDown = useCallback(
            (e: React.KeyboardEvent<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>) => {
                registry.runCurrent(e);
                if (props.onKeyDown != null) {
                    props.onKeyDown.call(null, e);
                }
            },
            [registry, props.onKeyDown],
        );

        const onBlur = useCallback(
            (e: React.FocusEvent<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>) => {
                e.stopPropagation();
                registry.currentLocalRegistry = null;
                if (typeof props.onBlur === 'function') {
                    props.onBlur.call(undefined, e);
                }
            },
            [registry, props.onBlur],
        );

        const onFocus = useCallback(
            (e: React.FocusEvent<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>) => {
                e.stopPropagation();
                registry.currentLocalRegistry = registry;
                if (typeof props.onFocus === 'function') {
                    props.onFocus.call(undefined, e);
                }
            },
            [registry, props.onFocus],
        );

        const comp = props.as == null ? 'div' : props.as;
        const children = React.createElement(
            comp,
            { ...childProps, onBlur, onFocus, onKeyDown, ref: ref },
            props.children,
        );

        return (
            <HotkeyContextProvider value={registry}>
                <NavigationContext.Provider children={children} value={tabRegistry} />
            </HotkeyContextProvider>
        );
    },
) as (<TComp extends keyof JSX.IntrinsicElements = 'div'>(
    props: ForwardRefProps<HTMLType<TComp>, Props<TComp>>,
) => JSX.Element) &
    ForwardRefComponent<Props<keyof JSX.IntrinsicElements>>;

TabBoundary.defaultProps = {
    as: 'div',
    crossGlobalBoundary: true,
    crossLocalBoundary: false,
    cycle: false,
    focusFirstOnNextOrigin: false,
    focusParentOnChildOrigin: false,
    focusParentOnEscape: false,
    scope: (scopes.local as any) as string,
} as const;

TabBoundary.displayName = 'hotkeys(TabBoundary)';
