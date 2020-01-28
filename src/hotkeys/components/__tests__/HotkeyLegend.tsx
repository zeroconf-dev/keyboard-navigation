import { cleanup, render } from '@testing-library/react';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyLegend';
import { hotkeyToText } from '@zeroconf/keyboard-navigation/hotkeys/components/__tests__/__helpers__/hotkeyToText';
import { HotKey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import * as React from 'react';

afterEach(cleanup);

const renderHotkey = (hotkey: HotKey) => <div>{hotkeyToText(hotkey)}</div>;

test('render legend does not throw', () => {
    render(
        <HotkeyLegend renderHotkey={renderHotkey}>
            <div />
        </HotkeyLegend>,
    );
});
