import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyLegend';
import { useHotkey } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyContext';
import { HotKey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import * as React from 'react';
import { useCallback } from 'react';

const hotkeyToText = (hotkey: HotKey) => {
    const res = [] as string[];

    if (hotkey.cmd) {
        res.push('⌘');
    }
    if (hotkey.ctrl) {
        res.push('⌃');
    }
    if (hotkey.mod) {
        res.push('⌃');
    }
    if (hotkey.meta) {
        res.push('❖');
    }
    if (hotkey.alt) {
        res.push('⌥');
    }
    if (hotkey.shift) {
        res.push('⇧');
    }

    switch (true) {
        case hotkey.key === 'ArrowDown':
            res.push('▼');
            break;
        case hotkey.key === 'ArrowLeft':
            res.push('◀');
            break;
        case hotkey.key === 'ArrowRight':
            res.push('▶');
            break;
        case hotkey.key === 'ArrowUp':
            res.push('▲');
            break;
        case hotkey.key === 'Backspace':
            res.push('⌫');
            break;
        case hotkey.key === 'ContextMenu':
            res.push('☰');
            break;
        case hotkey.key === 'Delete':
            res.push('Del');
            break;
        case hotkey.key === 'End':
            res.push('End');
            break;
        case hotkey.key === 'Enter':
            res.push('⏎');
            break;
        case hotkey.key === 'Escape':
            res.push('Esc');
            break;
        case hotkey.key === 'Home':
            res.push('Home');
            break;
        case hotkey.key === 'Insert':
            res.push('Ins');
            break;
        case hotkey.key === 'PageDown':
            res.push('Page ▲');
            break;
        case hotkey.key === 'PageUp':
            res.push('Page ▼');
            break;
        case hotkey.key === 'Tab':
            res.push('↹');
            break;
        default:
            if (hotkey.key != null) {
                res.push(hotkey.key);
            }
            break;
    }

    return res.join(' + ');
};

const renderHotkey = (hotkey: HotKey) => {
    const hotkeyText = hotkeyToText(hotkey);
    return <div key={hotkeyText}>{hotkeyText}</div>;
};

interface FocusByKeyProps {
    hotkey: string;
}

const hotkeyFiredAction = action('hotkey fired');
const FocusByKey: React.FC<FocusByKeyProps> = props => {
    const handler = useCallback(() => {
        hotkeyFiredAction(props.hotkey);
        return true;
    }, [props.hotkey]);
    useHotkey(props.hotkey, handler);
    return null;
};

storiesOf('HotkeyLegend', module)
    .add('Empty legend', () => <HotkeyLegend renderHotkey={renderHotkey} />)
    .add('Legend with simple content', () => (
        <>
            <FocusByKey hotkey="!ctrl" />
            <FocusByKey hotkey="!s" />
            <HotkeyLegend renderHotkey={renderHotkey} />
        </>
    ));
