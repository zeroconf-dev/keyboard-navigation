import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface HotkeyLegendProps {
    // tslint:disable-next-line:no-reserved-keywords
    as?: keyof JSX.IntrinsicElements;
    includeGlobal?: boolean;
    renderHotkey: (hotkey: Hotkey) => JSX.Element;
}
export const HotkeyLegend: React.FC<HotkeyLegendProps> = props => {
    const globalRegistry = useHotkeyRegistry().global;
    const [registry, setRegistry] = useState<HotkeyRegistry | null>(globalRegistry);
    useEffect(() => globalRegistry.subscribe(reg => setRegistry(reg)), [globalRegistry]);

    return registry == null ? null : (
        <> {Array.from(registry.iterHotkeys()).map(hotkey => props.renderHotkey(hotkey))}</>
    );
};
