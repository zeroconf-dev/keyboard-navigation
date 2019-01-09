import { useMemo } from 'react';
import { TabRegistry } from '../TabRegistry';

interface NewTabRegistryProps {
    cycle?: boolean;
    focusFirstOnNextOrigin?: boolean;
    focusParentOnChildOrigin?: boolean;
    tabRegistryRef?: React.RefObject<TabRegistry>;
}

export function useNewTabRegistry(props: NewTabRegistryProps): TabRegistry {
    const tabRegistry = useMemo(
        () =>
            new TabRegistry({
                cycle: props.cycle,
                focusFirstOnNextOrigin: props.focusFirstOnNextOrigin,
                focusParentOnChildOrigin: props.focusParentOnChildOrigin,
            }),
        [],
    );

    if (props.tabRegistryRef != null) {
        (props.tabRegistryRef as React.MutableRefObject<TabRegistry>).current = tabRegistry;
    }

    if (props.focusParentOnChildOrigin !== tabRegistry.focusParentOnChildOrigin) {
        tabRegistry.focusParentOnChildOrigin = props.focusParentOnChildOrigin === true;
    }

    if (props.focusFirstOnNextOrigin !== tabRegistry.focusFirstOnNextOrigin) {
        tabRegistry.focusFirstOnNextOrigin = props.focusFirstOnNextOrigin === true;
    }

    props.cycle ? tabRegistry.enableCycle() : tabRegistry.disableCycle();

    return tabRegistry;
}
