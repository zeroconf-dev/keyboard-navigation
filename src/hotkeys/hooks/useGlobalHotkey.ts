import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { parse } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import { useEffect, useMemo } from 'react';

export const useGlobalHotkey = (hotkeyStr: string, handler: () => boolean) => {
    const registry = useHotkeyRegistry().global;
    const hotkey = useMemo(() => parse(hotkeyStr), [hotkeyStr]);
    useEffect(() => {
        const hotkeyId = registry.add(hotkeyStr, hotkey, handler);
        return () => registry.remove(hotkeyId);
    }, [registry, hotkey, hotkeyStr, handler]);
};
