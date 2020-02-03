import { useTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useTabRegistry';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { FocuserOptions, TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import * as React from 'react';
import { useCallback, useLayoutEffect } from 'react';

export const useFocusable = <TElement extends HTMLElement = HTMLElement>(
    focusKey: string | undefined,
    focus: TabRegistry | ((opts: FocuserOptions) => boolean),
    onFocus?: (e: React.FocusEvent<TElement>) => void,
    onBlur?: (e: React.FocusEvent<TElement>) => void,
) => {
    const tabRegistry = useTabRegistry();
    const registry = useHotkeyRegistry();
    useLayoutEffect(() => {
        if (tabRegistry != null && focusKey != null) {
            tabRegistry.add(focusKey, focus);
        }
        return () => {
            if (tabRegistry != null && focusKey != null) {
                tabRegistry.delete(focusKey);
            }
        };
    }, [tabRegistry, focusKey, focus]);

    return {
        'data-focuskey': focusKey,
        onBlur: useCallback(
            (e: React.FocusEvent<TElement>) => {
                registry.currentLocalRegistry = null;
                if (onBlur != null) {
                    onBlur(e);
                }
            },
            [onBlur, registry],
        ),
        onFocus: useCallback(
            (e: React.FocusEvent<TElement>) => {
                registry.currentLocalRegistry = registry;
                if (onFocus != null) {
                    onFocus(e);
                }
            },
            [onFocus, registry],
        ),
        tabIndex: -1,
    };
};
