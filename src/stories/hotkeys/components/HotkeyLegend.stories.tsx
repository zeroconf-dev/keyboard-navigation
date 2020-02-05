import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyLegend';
import { useHotkey } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkey';
import { Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import * as React from 'react';
import { useCallback } from 'react';
import { hotkeyToText } from '../../../hotkeys/components/__tests__/__helpers__/hotkeyToText';

const renderHotkey = (hotkey: Hotkey) => {
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
            <FocusByKey hotkey="ctrl" />
            <FocusByKey hotkey="s" />
            <HotkeyLegend renderHotkey={renderHotkey} />
        </>
    ));
