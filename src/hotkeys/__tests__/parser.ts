import { parse, Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';

test('parse with empty string throws', () => {
    expect(() => parse('')).toThrow();
});

test('parse single char, returns Hotkey with no modifiers', () => {
    expect(parse('c')).toEqual({
        key: 'c',
    } as Hotkey);
});

describe('parse modifiers', () => {
    test('parse alt/option/⌥', () => {
        expect(parse('alt')).toEqual({ alt: true });
        expect(parse('option')).toEqual({ alt: true });
        expect(parse('⌥')).toEqual({ alt: true });
    });

    test('parse cmd/command/⌘', () => {
        expect(parse('cmd')).toEqual({ cmd: true });
        expect(parse('command')).toEqual({ cmd: true });
        expect(parse('⌘')).toEqual({ cmd: true });
    });

    test('parse ctrl/control/⌃', () => {
        expect(parse('ctrl')).toEqual({ ctrl: true });
        expect(parse('control')).toEqual({ ctrl: true });
        expect(parse('⌃')).toEqual({ ctrl: true });
    });

    test('parse meta/super/◆/◇/❖', () => {
        expect(parse('meta')).toEqual({ meta: true });
        expect(parse('super')).toEqual({ meta: true });
        expect(parse('◆')).toEqual({ meta: true });
        expect(parse('◇')).toEqual({ meta: true });
        expect(parse('❖')).toEqual({ meta: true });
    });

    test('parse mod', () => {
        expect(parse('mod')).toEqual({ mod: true });
    });

    test('parse shift/⇧', () => {
        expect(parse('shift')).toEqual({ shift: true });
        expect(parse('⇧')).toEqual({ shift: true });
    });
});

describe('parse special keys', () => {
    test('parse ArrowDown', () => {
        ['down', 'arrowdown', '⬇'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'ArrowDown' });
        });
    });

    test('parse ArrowLeft', () => {
        ['left', 'arrowleft', '⬅'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'ArrowLeft' });
        });
    });

    test('parse ArrowRight', () => {
        ['right', 'arrowright', '➡'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'ArrowRight' });
        });
    });

    test('parse ArrowUp', () => {
        ['up', 'arrowup', '⬆'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'ArrowUp' });
        });
    });

    test('parse Backspace', () => {
        ['backspace', '⌫', '⟵'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'Backspace' });
        });
    });

    test('parse ContextMenu', () => {
        ['menu', '▤', '☰', '𝌆', 'context', 'contextmenu'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'ContextMenu' });
        });
    });

    test('parse Delete', () => {
        ['delete', 'del', '⌦'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'Delete' });
        });
    });

    test('parse End', () => {
        ['end', '⤓'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'End' });
        });
    });

    test('parse Enter', () => {
        ['enter', '⏎'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'Enter' });
        });
    });

    test('parse Escape', () => {
        ['esc'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'Escape' });
        });
    });

    test('parse F1...F19 keys', () => {
        for (let F = 1; F < 20; F++) {
            expect(parse(`f${F}`)).toEqual({ key: `F${F}` });
            expect(parse(`F${F}`)).toEqual({ key: `F${F}` });
        }
    });

    test('parse Home', () => {
        ['home', '⤒'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'Home' });
        });
    });

    test('parse Insert', () => {
        ['insert', 'ins', '⎀'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'Insert' });
        });
    });

    test('parse PageDown', () => {
        ['pagedown', 'pgdn', '⇟'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'PageDown' });
        });
    });

    test('parse PageUp', () => {
        ['pageup', 'pgup', '⇞'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'PageUp' });
        });
    });

    test('parse Tab', () => {
        ['tab', '⭾', '↹', '⇥'].forEach(key => {
            expect(parse(key)).toEqual({ key: 'Tab' });
        });
    });
});

describe('simple keys', () => {
    test('parse simple keys', () => {
        // prettier-ignore
        [
            '0', '1', '2', '3', '4',
            '5', '6', '7', '8', '9',
            'a', 'b', 'c', 'd', 'e',
            'g', 'h', 'i', 'j', 'k',
            'l', 'm', 'n', 'o', 'p',
            'q', 'r', 's', 't', 'u',
            'v', 'w', 'x', 'y', 'z',
            '.', ',', '+', '-', '/',
            '!', '@', '#', '$', '%',
            '^', '&', '*', '(', ')',
            '=', '[', ']', '|', '?',
        ].forEach(key => {
            expect(parse(key)).toEqual({ key });
        });
    });
});

describe('modifier and special key combinations', () => {
    type ModifierKeys = keyof Hotkey;
    // prettier-ignore
    const allModifiers: ModifierKeys[] = [
        'ctrl', 'cmd', 'alt',
        'shift', 'meta', 'mod',
    ];
    // prettier-ignore
    const simpleKeys = [
        '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e',
        'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u',
        'v', 'w', 'x', 'y', 'z',
        '.', ',', '+', '-', '/',
        '!', '@', '#', '$', '%',
        '^', '&', '*', '(', ')',
        '=', '[', ']', '|', '?',
    ];

    // prettier-ignore
    const specialKeysMap: { [key: string]: string } = {
        backspace: 'Backspace',
        delete: 'Delete',
        down: 'ArrowDown',
        end: 'End',
        enter: 'Enter',
        escape: 'Escape',
        f1: 'F1', f2: 'F2', f3: 'F3', f4: 'F4', f5: 'F5',
        // tslint:disable-next-line:object-literal-sort-keys
        f6: 'F6', f7: 'F7', f8: 'F8', f9: 'F9', f10: 'F10',
        f11: 'F11', f12: 'F12', f13: 'F13', f14: 'F14',
        f15: 'F15', f16: 'F16', f17: 'F17', f18: 'F18', f19: 'F19',
        home: 'Home',
        ins: 'Insert',
        left: 'ArrowLeft',
        menu: 'ContextMenu',
        pgdn: 'PageDown',
        pgup: 'PageUp',
        right: 'ArrowRight',
        tab: 'Tab',
        up: 'ArrowUp',
    };

    const forEachCombinations = <TMap extends {}, TAlpha extends keyof TMap = keyof TMap>(
        alphabet: TAlpha[],
        fn: (combinations: TAlpha[], inUseMap: TMap) => void,
        inUseMap: TMap = {} as TMap,
        combinations: TAlpha[] = [],
    ) => {
        alphabet.forEach(mod => {
            if (inUseMap[mod]) {
                return;
            }

            const newInUseMap = { ...inUseMap, [mod]: true };
            const newCombinations = [...combinations, mod];

            fn(newCombinations, newInUseMap);
            forEachCombinations(alphabet.slice(1), fn, newInUseMap, newCombinations);
        });
    };

    test('modifier keys combinations', () => {
        expect.assertions(209);
        forEachCombinations<Hotkey>(allModifiers, (modifiers, hotkey) => {
            expect(parse(modifiers.join('+'))).toEqual(hotkey);
        });
    });

    test('modifier keys combinations with strict operator', () => {
        expect.assertions(209);
        forEachCombinations<Hotkey>(allModifiers, (modifiers, hotkey) => {
            expect(parse('!' + modifiers.join('+'))).toEqual({ ...hotkey, strict: true });
        });
    });

    test('modifier and simple keys combinations', () => {
        forEachCombinations<Hotkey>(allModifiers, (modifiers, hotkey) => {
            simpleKeys.forEach(key => {
                expect(parse(`${modifiers.join('+')}+${key}`)).toEqual({
                    ...hotkey,
                    key,
                });
            });
        });
    });

    test('modifier and simple keys combinations with strict operator', () => {
        forEachCombinations<Hotkey>(allModifiers, (modifiers, hotkey) => {
            simpleKeys.forEach(key => {
                expect(parse(`!${modifiers.join('+')}+${key}`)).toEqual({
                    ...hotkey,
                    key,
                    strict: true,
                });
            });
        });
    });

    test('modifier and special keys combinations', () => {
        forEachCombinations<Hotkey>(allModifiers, (modifiers, hotkey) => {
            Object.keys(specialKeysMap).forEach(key => {
                expect(parse(`${modifiers.join('+')}+${key}`)).toEqual({
                    ...hotkey,
                    key: specialKeysMap[key],
                });
            });
        });
    });

    test('modifier and special keys combinations with strict operator', () => {
        forEachCombinations<Hotkey>(allModifiers, (modifiers, hotkey) => {
            Object.keys(specialKeysMap).forEach(key => {
                expect(parse(`!${modifiers.join('+')}+${key}`)).toEqual({
                    ...hotkey,
                    key: specialKeysMap[key],
                    strict: true,
                });
            });
        });
    });
});

describe('strict operastor', () => {
    test('exclamation mark edge case', () => {
        expect(parse('!!')).toEqual({
            key: '!',
            strict: true,
        });

        expect(parse('!')).toEqual({
            key: '!',
        });
    });

    test('base cases', () => {
        expect(parse('!ctrl+!')).toEqual({
            ctrl: true,
            key: '!',
            strict: true,
        });
        expect(parse('!f')).toEqual({
            key: 'f',
            strict: true,
        });
    });
});

describe('plus operator', () => {
    test('plus key edge case', () => {
        expect(parse('ctrl++')).toEqual({
            ctrl: true,
            key: '+',
        });
        expect(parse('+')).toEqual({
            key: '+',
        });
    });
});
