import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyHandler } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { parse, Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import { useEffect, useMemo } from 'react';

type HotkeyTupple = [string, Hotkey, HotkeyHandler];

export const useHotkeys = (hotkeyMap: { [hotkeyStr: string]: HotkeyHandler }) => {
    const registry = useHotkeyRegistry();
    const hotkeys = useMemo(
        () =>
            Object.keys(hotkeyMap).map(
                hotkeyStr =>
                    [hotkeyStr, parse(hotkeyStr), hotkeyMap[hotkeyStr as keyof typeof hotkeyMap]] as HotkeyTupple,
            ),
        [hotkeyMap],
    );
    useEffect(() => {
        const hotkeyIds = hotkeys.map(hotkey => registry.add(hotkey[0], hotkey[1], hotkey[2]));
        return () => hotkeyIds.forEach(hotkeyId => registry.remove(hotkeyId));
    }, [registry, hotkeys]);
};
