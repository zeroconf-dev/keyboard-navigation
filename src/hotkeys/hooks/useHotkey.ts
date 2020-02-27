import { HotkeyRegistry, HotkeyHandler } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { parse } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import { useEffect, useMemo } from 'react';
import { useTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useTabRegistry';

export const useHotkey = (hotkeyStr: string, handler: HotkeyHandler, isGlobalHotkey = false) => {
    let hotkeyRegistry = (useHotkeyRegistry as (calledFromHotkey: boolean) => HotkeyRegistry)(true as any);
    if (isGlobalHotkey) {
        hotkeyRegistry = hotkeyRegistry.global;
    }
    const tabRegistry = useTabRegistry(false);
    const hotkey = useMemo(() => parse(hotkeyStr), [hotkeyStr]);
    useEffect(() => {
        const hotkeyId = hotkeyRegistry.add(hotkeyStr, hotkey, handler, tabRegistry);
        return () => hotkeyRegistry.remove(hotkeyId);
    }, [hotkeyRegistry, tabRegistry, hotkey, hotkeyStr, handler]);
};
