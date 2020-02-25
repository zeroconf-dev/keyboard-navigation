import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { HotkeyObject } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface HotkeyLegendProps {
    includeGlobal?: boolean;
    renderHotkey: (hotkey: HotkeyObject) => JSX.Element;
}
export const HotkeyLegend: React.FC<HotkeyLegendProps> = props => {
    const globalRegistry = useHotkeyRegistry().global;
    const [registry, setRegistry] = useState<HotkeyRegistry | null>(globalRegistry);
    const [, setUpdater] = useState(0);
    useEffect(
        () =>
            globalRegistry.subscribe(reg => {
                setRegistry(reg);
                setUpdater(s => s + 1);
            }),
        [globalRegistry],
    );

    return registry == null ? null : (
        <> {Array.from(registry.iterHotkeys()).map(hotkey => props.renderHotkey(hotkey))}</>
    );
};
