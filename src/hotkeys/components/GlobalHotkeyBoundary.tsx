import { HotkeyContextProvider } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyContext';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import {
    assertNeverNonThrow,
    filterPropKeys,
    ForwardRefComponent,
    ForwardRefProps,
    HTMLType,
    UnpackedHTMLElement,
    shouldHandleHotkey,
} from '@zeroconf/keyboard-navigation/util';
import React, { forwardRef, useCallback, useEffect } from 'react';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    hotkeyRegistryRef?: React.RefObject<HotkeyRegistry>;
}
export type GlobalHotkeyBoundaryProps<TComp extends keyof JSX.IntrinsicElements = 'div'> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
> &
    ComponentProps<TComp>;

const filterProps = <TComp extends keyof JSX.IntrinsicElements>(propKey: keyof ComponentProps<TComp>) => {
    switch (propKey) {
        case 'as':
        case 'hotkeyRegistryRef':
            return false;
        default:
            assertNeverNonThrow(propKey);
            return true;
    }
};

export const GlobalHotkeyBoundary = forwardRef(
    <TComp extends keyof JSX.IntrinsicElements = 'div'>(
        props: React.PropsWithChildren<GlobalHotkeyBoundaryProps<TComp>>,
        ref?: React.Ref<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>,
    ) => {
        const { hotkeyRegistryRef } = props;
        const registry = useHotkeyRegistry();

        if (registry !== registry.global) {
            throw new Error('The global hotkey boundary cannot be inside another hotkey boundary.');
        }

        useEffect(() => () => registry.dispose(), [registry]);
        useEffect(() => {
            if (hotkeyRegistryRef != null) {
                (hotkeyRegistryRef as React.MutableRefObject<HotkeyRegistry | null>).current = registry;
                return () => {
                    (hotkeyRegistryRef as React.MutableRefObject<HotkeyRegistry | null>).current = null;
                };
            }
            return;
        }, [hotkeyRegistryRef, registry]);

        const onKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (!shouldHandleHotkey(e)) {
                    return;
                }
                e.stopPropagation();
                registry.runCurrent(e);
            },
            [registry],
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
        const childProps = filterPropKeys<ComponentProps<TComp>, TComp, GlobalHotkeyBoundaryProps<TComp>>(
            props,
            filterProps,
        );
        const children = React.createElement(comp, { ...childProps, onBlur, onFocus, onKeyDown, ref }, props.children);

        return <HotkeyContextProvider value={registry}>{children}</HotkeyContextProvider>;
    },
) as (<TComp extends keyof JSX.IntrinsicElements = 'div'>(
    props: ForwardRefProps<HTMLType<TComp>, GlobalHotkeyBoundaryProps<TComp>>,
) => JSX.Element) &
    ForwardRefComponent<GlobalHotkeyBoundaryProps<keyof JSX.IntrinsicElements>>;

GlobalHotkeyBoundary.displayName = 'hotkeys(GlobalHotkeyBoundary)';
