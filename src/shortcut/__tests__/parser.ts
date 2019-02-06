import { parse, Hotkey } from '../parser';

test('parse with empty string throws', () => {
    expect(() => parse('')).toThrow();
});

test('parse single char, returns Hotkey with no modifiers true', () => {
    expect(parse('c')).toEqual({
        alt: false,
        ctrl: false,
        key: 'c',
        meta: false,
        shift: false,
    } as Hotkey);
});

test('parse shortcut combination, returns Hotkey with appropiate modifiers set true', () => {
    expect(parse('ctrl+b')).toEqual({
        alt: false,
        ctrl: true,
        key: 'b',
        meta: false,
        shift: false,
    } as Hotkey);
});
