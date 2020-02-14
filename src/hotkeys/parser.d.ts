interface Hotkey {
    alt?: boolean;
    cmd?: boolean;
    ctrl?: boolean;
    key?: string | null;
    meta?: boolean;
    mod?: boolean;
    shift?: boolean;
    nonStrict?: boolean;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
declare class lexer {
    parseError(text: string, hash: string): void;
}

export class Parser {
    public readonly Parser: new () => Parser;
    public readonly lexer: lexer;
    public parse(hotkey: string): Hotkey;
    public parseError(text: string, hash: string): void;
}

export const parser: Parser;

export function parse(hotkey: string): Hotkey;
