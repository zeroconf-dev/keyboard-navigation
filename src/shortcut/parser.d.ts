interface Hotkey {
    alt: boolean;
    ctrl: boolean;
    key: string | null;
    meta: boolean;
    shift: boolean;
}
export function parse(hotkey: string): Hotkey;
