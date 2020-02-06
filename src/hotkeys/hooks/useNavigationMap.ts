import { createNavigationHandler, HotkeyEvent, NavigationMap, TabRegistry } from '@zeroconf/keyboard-navigation/hooks';
import { useHotkeys } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeys';
import { getTargetFocusKey } from '@zeroconf/keyboard-navigation/util';
import { useMemo } from 'react';

export const useNavigationMap = <TElement extends HTMLElement = HTMLElement>(
    navigationMap: NavigationMap,
    tabRegistryRef: React.RefObject<TabRegistry>,
    tabDirectionAxix?: 'x' | 'y',
): void => {
    const navigationHandler = useMemo(() => {
        return createNavigationHandler(navigationMap, tabRegistryRef, tabDirectionAxix);
    }, [navigationMap, tabRegistryRef, tabDirectionAxix]);

    const hotkeyMap = useMemo(
        () => ({
            down: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowDown', e);
            },
            left: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowLeft', e);
            },
            right: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowRight', e);
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
            up: (e: HotkeyEvent) => {
                const focusKey = getTargetFocusKey((e as React.KeyboardEvent<TElement>).target);
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowUp', e);
            },
        }),
        [navigationHandler, tabRegistryRef],
    );

    useHotkeys(hotkeyMap);
};
