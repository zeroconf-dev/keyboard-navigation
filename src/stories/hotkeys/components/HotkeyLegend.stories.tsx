import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import {
    GlobalHotkeyBoundary as GlobalHotkeyBoundaryBase,
    Hotkey,
    HotkeyLegend,
    useHotkey,
} from '@zeroconf/keyboard-navigation';
import { hotkeyToText } from '@zeroconf/keyboard-navigation/hotkeys/components/__tests__/__helpers__/hotkeyToText';
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';

const renderHotkey = (hotkey: Hotkey) => {
    const hotkeyText = hotkeyToText(hotkey);
    return <li key={hotkeyText}>{hotkeyText}</li>;
};

interface FocusByKeyProps {
    hotkey: string;
    handler?: () => void;
}

const hotkeyFiredAction = action('hotkey fired');
const FocusByKey: React.FC<FocusByKeyProps> = props => {
    const handler = useCallback(() => {
        hotkeyFiredAction(props.hotkey);
        if (props.handler != null) {
            props.handler.call(undefined);
        }
        return true;
    }, [props.hotkey, props.handler]);
    useHotkey(props.hotkey, handler);
    return null;
};

const GlobalHotkeyBoundary = styled(GlobalHotkeyBoundaryBase)`
    &:focus {
        border-color: red;
    }
    border: 1px solid black;
    height: 100px;
    outline: 0;
    width: 100px;
`;

storiesOf('HotkeyLegend', module)
    .add('Empty legend', () => <HotkeyLegend renderHotkey={renderHotkey} />)
    .add('Legend with simple content', () => {
        const ref = useRef<HTMLDivElement | null>(null);
        const hotkeyRegistryRef = useRef<HotkeyRegistry | null>(null);
        useEffect(() => {
            if (ref.current != null) {
                ref.current.focus();
            }
            if (hotkeyRegistryRef.current != null) {
                hotkeyRegistryRef.current.currentLocalRegistry = hotkeyRegistryRef.current;
            }
        }, []);

        const blur = useCallback(() => {
            if (ref.current != null) {
                ref.current.blur();
            }
        }, [ref]);

        return (
            <GlobalHotkeyBoundary hotkeyRegistryRef={hotkeyRegistryRef} ref={ref} tabIndex={-1}>
                <FocusByKey hotkey="ctrl" />
                <FocusByKey hotkey="s" />
                <FocusByKey hotkey="esc" handler={blur} />
                <ol>
                    <HotkeyLegend renderHotkey={renderHotkey} />
                </ol>
            </GlobalHotkeyBoundary>
        );
    });
