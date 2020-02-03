import { HotkeyContextProvider } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyContext';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { scopes, HotkeyPublicScope, HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';

interface HotkeyBoundaryProps {
    crossGlobalBoundary: boolean;
    crossLocalBoundary: boolean;
    scope: HotkeyPublicScope;
}

export const HotkeyBoundary = (props: React.PropsWithChildren<HotkeyBoundaryProps>) => {
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

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            registry.runCurrent(e);
        },
        [registry],
    );

    return (
        <HotkeyContextProvider value={registry}>
            <div onKeyDown={onKeyDown}>{props.children}</div>
        </HotkeyContextProvider>
    );
};

HotkeyBoundary.defaultProps = {
    crossGlobalBoundary: true,
    crossLocalBoundary: true,
    scope: scopes.local,
};
