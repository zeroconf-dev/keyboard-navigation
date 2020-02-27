import { HotkeyHandler as RegistryHandler } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { parse, HotkeyObject } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import {
    isHotkeyMatching,
    getTargetFocusKey,
    WithEventTarget,
    shouldHandleHotkey,
} from '@zeroconf/keyboard-navigation/util';

type HotkeyHandler = (opts: Pick<Parameters<RegistryHandler>[0], 'focusKey' | 'event'>) => ReturnType<RegistryHandler>;

export interface HotkeysObject {
    [hotkey: string]: HotkeyHandler;
}

export interface EventBubbleControl {
    preventDefault: () => void;
    stopPropagation: () => void;
}

export interface HotkeyWithHandler extends HotkeyObject {
    handler: HotkeyHandler;
}

export interface HotkeyEvent {
    altKey: boolean;
    ctrlKey: boolean;
    key: string;
    metaKey: boolean;
    shiftKey: boolean;
}

export type HotkeyEventHandler = (e: HotkeyEvent & EventBubbleControl & WithEventTarget) => void;

export const createHandler = (hotkeys: HotkeysObject | HotkeyWithHandler[]): HotkeyEventHandler => {
    if (Array.isArray(hotkeys)) {
        return (event: HotkeyEvent & EventBubbleControl & WithEventTarget) => {
            if (!shouldHandleHotkey(event)) {
                return;
            }
            const focusKey = getTargetFocusKey(event.target);
            hotkeys
                .filter(hotkey => isHotkeyMatching(hotkey, event))
                .forEach(hotkeyObj => {
                    event.stopPropagation();
                    event.preventDefault();
                    hotkeyObj.handler({ focusKey: focusKey, event: event });
                });
        };
    } else {
        return createHandler(
            Object.keys(hotkeys).reduce((carry, hotkey) => {
                const r = parse(hotkey) as HotkeyWithHandler;
                r.handler = hotkeys[hotkey];
                carry.push(r);
                return carry;
            }, [] as HotkeyWithHandler[]),
        );
    }
};
