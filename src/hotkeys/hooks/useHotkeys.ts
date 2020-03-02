import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyRegistry, HotkeyMap } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { useEffect } from 'react';

export const useHotkeysInRegistry = (
    hotkeyRegistry: HotkeyRegistry | React.RefObject<HotkeyRegistry>,
    hotkeys: HotkeyMap,
) => {
    useEffect(() => {
        const resolvedRegistry = Object.prototype.hasOwnProperty.call(hotkeyRegistry, 'current')
            ? (hotkeyRegistry as React.RefObject<HotkeyRegistry>).current
            : (hotkeyRegistry as HotkeyRegistry);
        if (resolvedRegistry != null) {
            const hotkeyIds = resolvedRegistry.addAll(hotkeys);
            return () => resolvedRegistry.removeAll(hotkeyIds);
        }
        return;
    }, [hotkeyRegistry, hotkeys]);
};

export const useHotkeys = (hotkeyMap: HotkeyMap, isGlobalHotkeys = false) => {
    let hotkeyRegistry = (useHotkeyRegistry as (calledFromHotkey: boolean) => HotkeyRegistry)(true as any);
    if (isGlobalHotkeys) {
        hotkeyRegistry = hotkeyRegistry.global;
    }
    useHotkeysInRegistry(hotkeyRegistry, hotkeyMap);
};
