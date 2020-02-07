import { createNavigationHandler, NavigationMap } from '@zeroconf/keyboard-navigation/FieldNavigation';
import { ModifierKeys } from '@zeroconf/keyboard-navigation/hooks/components/Focuser';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import { useCallback, useMemo } from 'react';

export const useNavigationMap = <TElement extends HTMLElement = HTMLElement>(
    navigationMap: NavigationMap,
    tabRegistryRef: React.RefObject<TabRegistry>,
    tabDirectionAxix?: 'x' | 'y',
): React.DetailedHTMLProps<React.HTMLAttributes<TElement>, TElement> => {
    const navigationHandler = useMemo(() => {
        return createNavigationHandler(navigationMap, tabRegistryRef, tabDirectionAxix);
    }, [navigationMap, tabRegistryRef, tabDirectionAxix]);
    return {
        onKeyDown: useCallback(
            (e: React.KeyboardEvent<TElement>) => {
                const focusKey = (e.target as HTMLElement).dataset.focuskey;
                if (focusKey == null) {
                    throw new Error('Could not find focuskey');
                }
                let shouldPrevent = false;
                const modifierKeys: ModifierKeys = {
                    altKey: e.altKey,
                    ctrlKey: e.ctrlKey,
                    metaKey: e.metaKey,
                    shiftKey: e.shiftKey,
                };

                if (e.key === 'ArrowUp') {
                    shouldPrevent = true;
                    navigationHandler(focusKey, 'ArrowUp', modifierKeys);
                } else if (e.key === 'ArrowDown') {
                    shouldPrevent = true;
                    navigationHandler(focusKey, 'ArrowDown', modifierKeys);
                } else if (e.key === 'ArrowLeft') {
                    shouldPrevent = true;
                    navigationHandler(focusKey, 'ArrowLeft', modifierKeys);
                } else if (e.key === 'ArrowRight') {
                    shouldPrevent = true;
                    navigationHandler(focusKey, 'ArrowRight', modifierKeys);
                } else if (e.key === 'Tab') {
                    const tabRegistry = tabRegistryRef.current;
                    if (e.shiftKey) {
                        if (tabRegistry != null) {
                            shouldPrevent = true;
                            tabRegistry.focusPrev(focusKey);
                        }
                    } else {
                        if (tabRegistry != null) {
                            shouldPrevent = true;
                            tabRegistry.focusNext(focusKey);
                        }
                    }
                    if (tabRegistry == null) {
                        shouldPrevent = true;
                        navigationHandler(focusKey, 'Tab', modifierKeys);
                    }
                }

                if (shouldPrevent) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
            [navigationHandler, tabRegistryRef],
        ),
    };
};
