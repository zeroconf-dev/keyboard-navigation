import { HotkeyContextProvider } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyContext';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { scopes, HotkeyPublicScope, HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import {
    assertNeverNonThrow,
    filterPropKeys,
    ForwardRefComponent,
    ForwardRefProps,
    HTMLType,
    UnpackedHTMLElement,
    shouldHandleHotkey,
} from '@zeroconf/keyboard-navigation/util';
import React, { forwardRef, useCallback, useEffect, useMemo } from 'react';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as: TComp;
    crossGlobalBoundary: boolean;
    crossLocalBoundary: boolean;
    hotkeyRegistryRef?: React.RefObject<HotkeyRegistry>;
    scope: HotkeyPublicScope;
}
export type HotkeyBoundaryProps<TComp extends keyof JSX.IntrinsicElements = 'div'> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
> &
    ComponentProps<TComp>;

const filterProps = <TComp extends keyof JSX.IntrinsicElements>(propKey: keyof ComponentProps<TComp>) => {
    switch (propKey) {
        case 'as':
        case 'crossGlobalBoundary':
        case 'crossLocalBoundary':
        case 'hotkeyRegistryRef':
        case 'scope':
            return false;
        default:
            assertNeverNonThrow(propKey);
            return true;
    }
};

const defaultProps = {
    as: 'div',
    crossGlobalBoundary: true,
    crossLocalBoundary: false,
    scope: (scopes.local as unknown) as string,
} as const;

export const HotkeyBoundary = forwardRef(
    <TComp extends keyof JSX.IntrinsicElements = 'div'>(
        props: React.PropsWithChildren<HotkeyBoundaryProps<TComp>>,
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

        useEffect(() => () => registry.dispose(), [registry]);
        useEffect(() => {
            if (hotkeyRegistryRef != null) {
                (hotkeyRegistryRef as React.MutableRefObject<HotkeyRegistry | null>).current = registry;
                return () => {
                    (hotkeyRegistryRef as React.MutableRefObject<HotkeyRegistry | null>).current = null;
                };
            }
            return;
        }, [registry, hotkeyRegistryRef]);

        const onKeyDown = useCallback(
            (e: React.KeyboardEvent<UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>>) => {
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
        const childProps = filterPropKeys<ComponentProps<TComp>, TComp, HotkeyBoundaryProps<TComp>>(props, filterProps);
        const children = React.createElement(comp, { ...childProps, onBlur, onFocus, onKeyDown, ref }, props.children);

        return <HotkeyContextProvider value={registry}>{children}</HotkeyContextProvider>;
    },
) as (<TComp extends keyof JSX.IntrinsicElements = 'div'>(
    props: ForwardRefProps<HTMLType<TComp>, HotkeyBoundaryProps<TComp>>,
) => JSX.Element) &
    ForwardRefComponent<HotkeyBoundaryProps<keyof JSX.IntrinsicElements>, typeof defaultProps>;

HotkeyBoundary.defaultProps = defaultProps;

HotkeyBoundary.displayName = 'hotkeys(HotkeyBoundary)';
