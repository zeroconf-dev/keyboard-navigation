interface HotKey {
    alt?: boolean;
    cmd?: boolean;
    ctrl?: boolean;
    key?: string;
    meta?: boolean;
    mod?: boolean;
    shift?: boolean;
    strict?: boolean;
}
export function parse(hotkey: string): HotKey;
