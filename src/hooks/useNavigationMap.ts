import { createNavigationHandler, NavigationFieldMap } from '@zeroconf/keyboard-navigation/FieldNavigation';
import { ModifierKeys } from '@zeroconf/keyboard-navigation/hooks/components/Focuser';
import { useCallback, useMemo } from 'react';
import { useTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useTabRegistry';

export const useNavigationMap = <TElement extends HTMLElement = HTMLElement>(
    navigationMap: NavigationFieldMap,
    tabDirectionAxix?: 'x' | 'y',
): React.DetailedHTMLProps<React.HTMLAttributes<TElement>, TElement> => {
    const tabRegistry = useTabRegistry();
    const navigationHandler = useMemo(() => {
        return createNavigationHandler(navigationMap, tabRegistry, tabDirectionAxix);
    }, [navigationMap, tabRegistry, tabDirectionAxix]);
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
            [navigationHandler, tabRegistry],
        ),
    };
};
