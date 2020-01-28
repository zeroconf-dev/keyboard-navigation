import { useTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useTabRegistry';
import { FocuserOptions, TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import * as React from 'react';

export const useFocusable = <TElement extends HTMLElement = HTMLElement>(
    focusKey: string | undefined,
    focus: TabRegistry | ((opts: FocuserOptions) => boolean),
) => {
    const tabRegistry = useTabRegistry();
    React.useLayoutEffect(() => {
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
        tabIndex: -1,
    } as React.DetailedHTMLProps<React.HTMLAttributes<TElement>, TElement>;
};
