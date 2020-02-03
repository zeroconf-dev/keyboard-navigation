import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
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
    const context = useHotkeyRegistry();
    const [, setUpdater] = useState(0);
    useEffect(() => context.subscribe(() => setUpdater(s => s + 1)), [context]);
    return <>{Array.from(context.iterHotkeys()).map(hotkey => props.renderHotkey(hotkey))}</>;
};
