import { HotkeyHandler } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { parse, Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import { hasModifierKey, isHotkeyMatching, isNativeInput } from '@zeroconf/keyboard-navigation/util';

export interface HotkeysObject {
    [hotkey: string]: HotkeyHandler;
}

export interface EventBubbleControl {
    preventDefault: () => void;
    stopPropagation: () => void;
}

export interface HotkeyWithHandler extends Hotkey {
    handler: HotkeyHandler;
}

export interface HotkeyEvent {
    altKey: boolean;
    ctrlKey: boolean;
    key: string;
    metaKey: boolean;
    shiftKey: boolean;
}

interface WithEventTarget {
    target: EventTarget;
}
export type HotkeyEventHandler = (e: HotkeyEvent & EventBubbleControl & WithEventTarget) => void;

const shouldHandleHotkey = (event: HotkeyEvent & WithEventTarget) =>
    hasModifierKey(event) || !isNativeInput(event.target);

export const createHandler = (hotkeys: HotkeysObject | HotkeyWithHandler[]): HotkeyEventHandler => {
    if (Array.isArray(hotkeys)) {
        return (e: HotkeyEvent & EventBubbleControl & WithEventTarget) => {
            if (!shouldHandleHotkey(e)) {
                return;
            }
            hotkeys
                .filter(hotkey => isHotkeyMatching(hotkey, e))
                .forEach(hotkeyObj => {
                    e.stopPropagation();
                    e.preventDefault();
                    hotkeyObj.handler(e);
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
