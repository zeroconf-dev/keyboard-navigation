import { useHotkeyContext } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyContext';
import { HotKey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import * as React from 'react';

interface HotkeyLegendProps {
    // tslint:disable-next-line:no-reserved-keywords
    as?: keyof JSX.IntrinsicElements;
    includeGlobal?: boolean;
    renderHotkey: (hotkey: HotKey) => JSX.Element;
}
export const HotkeyLegend: React.FC<HotkeyLegendProps> = props => {
    const context = useHotkeyContext();
    return <>{context.getHotkeys().map(hotkey => props.renderHotkey(hotkey))}</>;
};
