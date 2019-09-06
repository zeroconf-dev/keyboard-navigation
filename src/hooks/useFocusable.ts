import * as React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { useTabRegistry } from './useTabRegistry';

export const useFocusable = (
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
};
