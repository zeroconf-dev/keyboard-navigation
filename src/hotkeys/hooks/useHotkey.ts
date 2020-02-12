import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { parse } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import { useEffect, useMemo } from 'react';

export const useHotkey = (hotkeyStr: string, handler: () => boolean, isGlobalHotkey = false) => {
    let registry = (useHotkeyRegistry as (calledFromHotkey: boolean) => HotkeyRegistry)(true as any);
    if (isGlobalHotkey) {
        registry = registry.global;
    }
    const hotkey = useMemo(() => parse(hotkeyStr), [hotkeyStr]);
    useEffect(() => {
        const hotkeyId = registry.add(hotkeyStr, hotkey, handler);
        return () => registry.remove(hotkeyId);
    }, [registry, hotkey, hotkeyStr, handler]);
};
