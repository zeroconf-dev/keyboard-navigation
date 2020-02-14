import { createNavigationHandler, NavigationMap, TabRegistry } from '@zeroconf/keyboard-navigation/hooks';
import { HotkeyEvent } from '@zeroconf/keyboard-navigation/hotkeys/createHandler';
import { useHotkeysInRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeys';
import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { getTargetFocusKey } from '@zeroconf/keyboard-navigation/util';
import { useMemo, useRef } from 'react';

export const useNavigationMap = <TElement extends HTMLElement = HTMLElement>(
    navigationMap: NavigationMap,
    tabDirectionAxix?: 'x' | 'y',
) => {
    const tabRegistryRef = useRef<TabRegistry>(null);
    const hotkeyRegistryRef = useRef<HotkeyRegistry>(null);

    const navigationHandler = useMemo(() => {
        return createNavigationHandler(navigationMap, tabRegistryRef, tabDirectionAxix);
    }, [navigationMap, tabRegistryRef, tabDirectionAxix]);

    const hotkeyMap = useMemo(
        () => ({
            left: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowLeft', e);
            },
            down: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowDown', e);
            },
            right: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowRight', e);
            },
            up: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowUp', e);
            },
            tab: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                const tabRegistry = tabRegistryRef.current;
                if (focusKey == null) {
                    return false;
                }

                if (tabRegistry == null) {
                    return navigationHandler(focusKey, 'Tab', e);
                } else {
                    return tabRegistry.focusNext(focusKey);
                }
            },
            'shift+tab': (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                const tabRegistry = tabRegistryRef.current;
                if (focusKey == null) {
                    return false;
                }

                if (tabRegistry == null) {
                    return navigationHandler(focusKey, 'Tab', e);
                } else {
                    return tabRegistry.focusPrev(focusKey);
                }
            },
        }),
        [navigationHandler, tabRegistryRef],
    );

    useHotkeysInRegistry(hotkeyRegistryRef, hotkeyMap);

    return {
        hotkeyRegistryRef,
        tabRegistryRef,
    };
};
