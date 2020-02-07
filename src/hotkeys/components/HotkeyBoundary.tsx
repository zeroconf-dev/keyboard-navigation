import { HotkeyContextProvider } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyContext';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { scopes, HotkeyPublicScope, HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLElement } from '@zeroconf/keyboard-navigation/util';
import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
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

export const HotkeyBoundary = <TComp extends keyof JSX.IntrinsicElements>(
    props: React.PropsWithChildren<HotkeyBoundaryProps<TComp>>,
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
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            registry.runCurrent(e);
        },
        [registry],
    );

    const comp = props.as == null ? 'div' : props.as;
    const childProps = filterPropKeys<ComponentProps<TComp>, TComp, HotkeyBoundaryProps<TComp>>(props, filterProps);
    const children = React.createElement(comp, { ...childProps, onKeyDown }, props.children);

    return <HotkeyContextProvider value={registry}>{children}</HotkeyContextProvider>;
};

HotkeyBoundary.defaultProps = {
    crossGlobalBoundary: true,
    crossLocalBoundary: false,
    scope: scopes.local,
};

HotkeyBoundary.displayName = 'hotkeys(HotkeyBoundary)';
