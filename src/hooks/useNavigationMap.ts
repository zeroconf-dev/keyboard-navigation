import { createNavigationHandler, ModifierKeys, NavigationMap, TabRegistry } from '@zeroconf/keyboard-navigation/hooks';
import { useCallback, useMemo } from 'react';

export const useNavigationMap = <TElement extends HTMLElement = HTMLElement>(
    navigationMap: NavigationMap,
    tabRegistryRef: React.RefObject<TabRegistry>,
): React.DetailedHTMLProps<React.HTMLAttributes<TElement>, TElement> => {
    const navigationHandler = useMemo(() => {
        return createNavigationHandler(navigationMap, tabRegistryRef);
    }, [navigationMap, tabRegistryRef]);
    return {
        onKeyDown: useCallback(
            (e: React.KeyboardEvent<TElement>) => {
                const focusKey = e.currentTarget.dataset.focuskey as string;
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
