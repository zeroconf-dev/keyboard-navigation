import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { HotkeyObject } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import React, { useEffect, useState } from 'react';
import { useForceRender } from '@zeroconf/keyboard-navigation/hooks/useForceRender';

interface HotkeyLegendProps {
    includeGlobal?: boolean;
    renderHotkey: (hotkey: HotkeyObject) => JSX.Element;
}
export const HotkeyLegend: React.FC<HotkeyLegendProps> = props => {
    const globalRegistry = useHotkeyRegistry().global;
    const [currentRegistry, setCurrentRegistry] = useState<HotkeyRegistry | null>(globalRegistry.currentLocalRegistry);
    const forceRender = useForceRender();

    useEffect(() => {
        if (currentRegistry !== globalRegistry.currentLocalRegistry) {
            setCurrentRegistry(globalRegistry.currentLocalRegistry);
            forceRender();
        }
        return globalRegistry.subscribe(reg => {
            setCurrentRegistry(reg);
            forceRender();
        });
    }, [globalRegistry, currentRegistry, forceRender]);

    return currentRegistry == null ? null : (
        <> {Array.from(currentRegistry.iterHotkeys()).map(hotkey => props.renderHotkey(hotkey))}</>
    );
};
