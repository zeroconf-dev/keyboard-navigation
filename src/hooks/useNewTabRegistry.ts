import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import React, { useEffect, useMemo } from 'react';

interface NewTabRegistryProps {
    cycle?: boolean;
    focusFirstOnNextOrigin?: boolean;
    focusParentOnChildOrigin?: boolean;
    tabRegistryRef?: React.RefObject<TabRegistry>;
}

export function useNewTabRegistry(props: NewTabRegistryProps): TabRegistry {
    const { cycle, focusFirstOnNextOrigin, focusParentOnChildOrigin, tabRegistryRef } = props;
    const tabRegistry = useMemo(() => {
        const registry = new TabRegistry({
            cycle: props.cycle,
            focusFirstOnNextOrigin: props.focusFirstOnNextOrigin,
            focusParentOnChildOrigin: props.focusParentOnChildOrigin,
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

        tabRegistry.focusParentOnChildOrigin = props.focusParentOnChildOrigin === true;
        tabRegistry.focusFirstOnNextOrigin = props.focusFirstOnNextOrigin === true;

        if (tabRegistry.isCycleEnabled && !cycle) {
            tabRegistry.disableCycle();
        }
        if (!tabRegistry.isCycleEnabled && cycle) {
            tabRegistry.enableCycle();
        }
    }, [cycle, focusFirstOnNextOrigin, focusParentOnChildOrigin, tabRegistry, tabRegistryRef]);

    return tabRegistry;
}
