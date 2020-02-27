import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyRegistry, HotkeyMap } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { useEffect } from 'react';

export const useHotkeysInRegistry = (
    registry: HotkeyRegistry | React.RefObject<HotkeyRegistry>,
    hotkeys: HotkeyMap,
) => {
    useEffect(() => {
        const resolvedRegistry = Object.prototype.hasOwnProperty.call(registry, 'current')
            ? (registry as React.RefObject<HotkeyRegistry>).current
            : (registry as HotkeyRegistry);
        if (resolvedRegistry != null) {
            const hotkeyIds = resolvedRegistry.addAll(hotkeys);
            return () => resolvedRegistry.removeAll(hotkeyIds);
        }
        return;
    }, [registry, hotkeys]);
};

export const useHotkeys = (hotkeyMap: HotkeyMap, isGlobalHotkeys = false) => {
    let registry = (useHotkeyRegistry as (calledFromHotkey: boolean) => HotkeyRegistry)(true as any);
    if (isGlobalHotkeys) {
        registry = registry.global;
    }
    useHotkeysInRegistry(registry, hotkeyMap);
};
