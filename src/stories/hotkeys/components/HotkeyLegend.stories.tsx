import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import {
    GlobalHotkeyBoundary as GlobalHotkeyBoundaryBase,
    HotkeyObject,
    HotkeyLegend,
} from '@zeroconf/keyboard-navigation';
import { hotkeyToText } from '@zeroconf/keyboard-navigation/hotkeys/components/__tests__/helpers/hotkeyToText';
import React, { useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { Hotkey as HotkeyBase } from '@zeroconf/keyboard-navigation/hotkeys/components';

const renderHotkey = (hotkey: HotkeyObject) => {
    const hotkeyText = hotkeyToText(hotkey);
    return <li key={hotkeyText}>{hotkeyText}</li>;
};

interface FocusByKeyProps {
    hotkey: string;
    handler?: () => boolean;
}

const hotkeyFiredAction = action('hotkey fired');
const Hotkey: React.FC<FocusByKeyProps> = props => {
    const handler = useCallback(() => {
        hotkeyFiredAction(props.hotkey);
        if (props.handler != null) {
            props.handler.call(undefined);
        }
        return true;
    }, [props.hotkey, props.handler]);
    return <HotkeyBase hotkey={props.hotkey} handler={handler} />;
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
                return true;
            }
            return false;
        }, [ref]);

        return (
            <GlobalHotkeyBoundary hotkeyRegistryRef={hotkeyRegistryRef} ref={ref} tabIndex={-1}>
                <Hotkey hotkey="ctrl" />
                <Hotkey hotkey="s" />
                <Hotkey hotkey="esc" handler={blur} />
                <ol>
                    <HotkeyLegend renderHotkey={renderHotkey} />
                </ol>
            </GlobalHotkeyBoundary>
        );
    });
