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
} from '@zeroconf/keyboard-navigation/util';
import * as React from 'react';
import { forwardRef, useCallback, useEffect } from 'react';

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
                registry.runCurrent(e);
            },
            [registry],
        );

        const comp = props.as == null ? 'div' : props.as;
        const childProps = filterPropKeys<ComponentProps<TComp>, TComp, GlobalHotkeyBoundaryProps<TComp>>(
            props,
            filterProps,
        );
        const children = React.createElement(comp, { ...childProps, onKeyDown, ref }, props.children);

        return <HotkeyContextProvider value={registry}>{children}</HotkeyContextProvider>;
    },
) as (<TComp extends keyof JSX.IntrinsicElements = 'div'>(
    props: ForwardRefProps<HTMLType<TComp>, GlobalHotkeyBoundaryProps<TComp>>,
) => JSX.Element) &
    ForwardRefComponent<GlobalHotkeyBoundaryProps<keyof JSX.IntrinsicElements>>;

GlobalHotkeyBoundary.displayName = 'hotkeys(GlobalHotkeyBoundary)';
