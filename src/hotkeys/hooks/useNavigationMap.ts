import { createNavigationHandler, NavigationFieldMap, useTabRegistry } from '@zeroconf/keyboard-navigation/hooks';
import { useHotkeys } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeys';
import { HotkeyMap } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { useMemo } from 'react';

export const useNavigationMap = (navigationMap: NavigationFieldMap, tabDirectionAxix?: 'x' | 'y') => {
    const tabRegistry = useTabRegistry();

    const navigationHandler = useMemo(() => {
        return createNavigationHandler(navigationMap, tabRegistry, tabDirectionAxix);
    }, [navigationMap, tabRegistry, tabDirectionAxix]);

    const hotkeyMap: HotkeyMap = useMemo(
        () => ({
            left: ({ focusKey, event }) => {
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowLeft', event);
            },
            down: ({ focusKey, event }) => {
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowDown', event);
            },
            right: ({ focusKey, event }) => {
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowRight', event);
            },
            up: ({ focusKey, event }) => {
                return focusKey == null ? false : navigationHandler(focusKey, 'ArrowUp', event);
            },
            tab: ({ focusKey, event }) => {
                if (focusKey == null) {
                    return false;
                }

                if (tabRegistry == null) {
                    return navigationHandler(focusKey, 'Tab', event);
                } else {
                    return tabRegistry.focusNext(focusKey);
                }
            },
            'shift+tab': ({ focusKey, event }) => {
                if (focusKey == null) {
                    return false;
                }

                if (tabRegistry == null) {
                    return navigationHandler(focusKey, 'Tab', event);
                } else {
                    return tabRegistry.focusPrev(focusKey);
                }
            },
        }),
        [navigationHandler, tabRegistry],
    );

    useHotkeys(hotkeyMap);
};
