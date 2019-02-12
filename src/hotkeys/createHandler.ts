import { parse, HotKey } from './parser';

export interface HotKeysObject {
    [hotkey: string]: () => void;
}

export interface HotKeyWithHandler extends HotKey {
    handler: () => void;
}

export interface HotKeyEvent {
    altKey: boolean;
    ctrlKey: boolean;
    key: string;
    metaKey: boolean;
    shiftKey: boolean;
}

export type HotKeyHandler = (e: HotKeyEvent & { preventDefault: () => void; stopPropagation: () => void }) => void;

export function isModifierMatching(hotkey: HotKey, event: HotKeyEvent): boolean {
    if (hotkey.strict) {
        return (
            Boolean(hotkey.alt) === event.altKey &&
            Boolean(hotkey.ctrl) === event.ctrlKey &&
            Boolean(hotkey.meta) === event.metaKey &&
            Boolean(hotkey.shift) === event.shiftKey
        );
    } else {
        return (
            (event.altKey || !hotkey.alt) &&
            (event.ctrlKey || !hotkey.ctrl) &&
            (event.metaKey || !hotkey.meta) &&
            (event.shiftKey || !hotkey.shift)
        );
    }
}

export function isKeyMatching(hotkey: HotKey, event: HotKeyEvent): boolean {
    if (hotkey.strict) {
        return (hotkey.key == null && event.key.length !== 1) || hotkey.key === event.key;
    } else {
        return hotkey.key == null || hotkey.key === event.key;
    }
}

export function isHotkeyMatching(hotkey: HotKey, event: HotKeyEvent): boolean {
    return isModifierMatching(hotkey, event) && isKeyMatching(hotkey, event);
}

export function createHandler(hotkeys: HotKeysObject | HotKeyWithHandler[]): HotKeyHandler {
    if (Array.isArray(hotkeys)) {
        return (e: HotKeyEvent & { preventDefault: () => void; stopPropagation: () => void }) => {
            hotkeys
                .filter(hotkey => isHotkeyMatching(hotkey, e))
                .forEach(hotkeyObj => {
                    e.stopPropagation();
                    e.preventDefault();
                    hotkeyObj.handler();
                });
        };
    } else {
        return createHandler(
            Object.keys(hotkeys).reduce(
                (carry, hotkey) => {
                    const r = parse(hotkey) as HotKeyWithHandler;
                    r.handler = hotkeys[hotkey];
                    carry.push(r);
                    return carry;
                },
                [] as HotKeyWithHandler[],
            ),
        );
    }
}
