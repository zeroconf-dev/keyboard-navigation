import { TabRegistry, FocuserFn } from '@zeroconf/keyboard-navigation/TabRegistry';
import React, { useEffect, useMemo } from 'react';

interface NewTabRegistryProps {
    cycle?: boolean;
    focusFirstOnNextOrigin?: boolean;
    focusParentOnChildOrigin?: boolean;
    focusSelfHandler?: FocuserFn;
    tabRegistryRef?: React.RefObject<TabRegistry>;
}

export function useNewTabRegistry(props: NewTabRegistryProps): TabRegistry {
    const { cycle, focusFirstOnNextOrigin, focusParentOnChildOrigin, focusSelfHandler, tabRegistryRef } = props;
    const tabRegistry = useMemo(() => {
        const registry = new TabRegistry({
            cycle: cycle,
            focusFirstOnNextOrigin: focusFirstOnNextOrigin,
            focusParentOnChildOrigin: focusParentOnChildOrigin,
            focusSelfHandler: focusSelfHandler,
        });
        if (tabRegistryRef != null) {
            (tabRegistryRef as React.MutableRefObject<TabRegistry>).current = registry;
        }
        return registry;
    }, []);

    useEffect(() => {
        if (tabRegistryRef != null) {
            (tabRegistryRef as React.MutableRefObject<TabRegistry>).current = tabRegistry;
        }

        tabRegistry.focusParentOnChildOrigin = focusParentOnChildOrigin === true;
        tabRegistry.focusFirstOnNextOrigin = focusFirstOnNextOrigin === true;
        tabRegistry.focusSelfHandler = focusSelfHandler || null;

        if (tabRegistry.isCycleEnabled && !cycle) {
            tabRegistry.disableCycle();
        }
        if (!tabRegistry.isCycleEnabled && cycle) {
            tabRegistry.enableCycle();
        }
    }, [cycle, focusFirstOnNextOrigin, focusParentOnChildOrigin, focusSelfHandler, tabRegistry, tabRegistryRef]);

    return tabRegistry;
}
