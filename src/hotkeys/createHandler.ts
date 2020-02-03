import { HotkeyHandler } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { parse, Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';

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

export type HotkeyEventHandler = (e: HotkeyEvent & EventBubbleControl) => void;

export function isModifierMatching(hotkey: Hotkey, event: HotkeyEvent): boolean {
    if (hotkey.nonStrict) {
        return (
            (event.altKey || !hotkey.alt) &&
            (event.ctrlKey || !hotkey.ctrl) &&
            (event.metaKey || !hotkey.meta) &&
            (event.shiftKey || !hotkey.shift)
        );
    } else {
        return (
            Boolean(hotkey.alt) === event.altKey &&
            Boolean(hotkey.ctrl) === event.ctrlKey &&
            Boolean(hotkey.meta) === event.metaKey &&
            Boolean(hotkey.shift) === event.shiftKey
        );
    }
}

export function isKeyMatching(hotkey: Hotkey, event: HotkeyEvent): boolean {
    if (hotkey.nonStrict) {
        return hotkey.key == null || hotkey.key === (event.key.length === 1 ? event.key.toLowerCase() : event.key);
    } else {
        return (
            (hotkey.key == null && event.key.length !== 1) ||
            hotkey.key === (event.key.length === 1 ? event.key.toLowerCase() : event.key)
        );
    }
}

export function isHotkeyMatching(hotkey: Hotkey, event: HotkeyEvent): boolean {
    return isModifierMatching(hotkey, event) && isKeyMatching(hotkey, event);
}

export function createHandler(hotkeys: HotkeysObject | HotkeyWithHandler[]): HotkeyEventHandler {
    if (Array.isArray(hotkeys)) {
        return (e: HotkeyEvent & EventBubbleControl) => {
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
}
