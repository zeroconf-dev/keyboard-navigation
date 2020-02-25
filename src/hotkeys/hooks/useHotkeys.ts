import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyHandler, HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { parse, HotkeyObject } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import { useEffect, useMemo } from 'react';

type HotkeyTupple = [string, HotkeyObject, HotkeyHandler];

export const useHotkeysInRegistry = (
    registry: HotkeyRegistry | React.RefObject<HotkeyRegistry>,
    hotkeyMap: { [hotkeyStr: string]: HotkeyHandler },
) => {
    const hotkeys = useMemo(
        () =>
            Object.keys(hotkeyMap).map(
                hotkeyStr =>
                    [hotkeyStr, parse(hotkeyStr), hotkeyMap[hotkeyStr as keyof typeof hotkeyMap]] as HotkeyTupple,
            ),
        [hotkeyMap],
    );

    useEffect(() => {
        const resolvedRegistry = Object.prototype.hasOwnProperty.call(registry, 'current')
            ? (registry as React.RefObject<HotkeyRegistry>).current
            : (registry as HotkeyRegistry);
        if (resolvedRegistry != null) {
            const hotkeyIds = hotkeys.map(hotkey => resolvedRegistry.add(hotkey[0], hotkey[1], hotkey[2]));
            return () => hotkeyIds.forEach(hotkeyId => resolvedRegistry.remove(hotkeyId));
        }
        return;
    }, [registry, hotkeys]);
};

export const useHotkeys = (hotkeyMap: { [hotkeyStr: string]: HotkeyHandler }, isGlobalHotkeys = false) => {
    let registry = (useHotkeyRegistry as (calledFromHotkey: boolean) => HotkeyRegistry)(true as any);
    if (isGlobalHotkeys) {
        registry = registry.global;
    }
    useHotkeysInRegistry(registry, hotkeyMap);
};
