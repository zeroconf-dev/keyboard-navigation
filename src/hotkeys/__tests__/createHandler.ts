import { isKeyMatching, isModifierMatching, HotkeyEvent } from '@zeroconf/keyboard-navigation/hotkeys/createHandler';
import { Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';

type Modifier = 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey';
const modifiers: Modifier[] = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'];

// prettier-ignore
const keys: string[] = [
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
    'Control', 'Alt', 'Shift',
    'Meta', 'Escape', 'Enter',
];

const noModifiers: HotkeyEvent = {
    altKey: false,
    ctrlKey: false,
    key: '',
    metaKey: false,
    shiftKey: false,
};

function iterateModifiers(
    fn: (event: HotkeyEvent, mods: Modifier[]) => void,
    current: HotkeyEvent = {
        altKey: false,
        ctrlKey: false,
        key: '',
        metaKey: false,
        shiftKey: false,
    },
    mods: Modifier[] = [],
) {
    modifiers.forEach(mod => {
        if (mods.indexOf(mod) !== -1) {
            return;
        }
        fn(current, mods);
        iterateModifiers(
            fn,
            {
                ...current,
                [mod]: true,
            },
            [...mods, mod],
        );
    });
}

describe('isModifierMatching', () => {
    describe('strict', () => {
        test('alt', () => {
            const hotkey: Hotkey = {
                alt: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 1 && event.altKey);
            });
        });

        test('ctrl', () => {
            const hotkey: Hotkey = {
                ctrl: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 1 && event.ctrlKey);
            });
        });

        test('meta', () => {
            const hotkey: Hotkey = {
                meta: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 1 && event.metaKey);
            });
        });

        test('shift', () => {
            const hotkey: Hotkey = {
                shift: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 1 && event.shiftKey);
            });
        });

        test('alt+ctrl', () => {
            const hotkey: Hotkey = {
                alt: true,
                ctrl: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 2 && event.altKey && event.ctrlKey);
            });
        });

        test('alt+meta', () => {
            const hotkey: Hotkey = {
                alt: true,
                meta: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 2 && event.altKey && event.metaKey);
            });
        });

        test('alt+shift', () => {
            const hotkey: Hotkey = {
                alt: true,
                shift: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 2 && event.altKey && event.shiftKey);
            });
        });

        test('alt+ctrl+meta', () => {
            const hotkey: Hotkey = {
                alt: true,
                ctrl: true,
                meta: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(
                    mods.length === 3 && event.altKey && event.ctrlKey && event.metaKey,
                );
            });
        });

        test('alt+ctrl+shift', () => {
            const hotkey: Hotkey = {
                alt: true,
                ctrl: true,
                shift: true,
            };

            iterateModifiers((event: HotkeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(
                    mods.length === 3 && event.altKey && event.ctrlKey && event.shiftKey,
                );
            });
        });

        test('alt+ctrl+meta+shift', () => {
            const hotkey: Hotkey = {
                alt: true,
                ctrl: true,
                meta: true,
                shift: true,
            };

            iterateModifiers((event, mods) => {
                expect(isModifierMatching(hotkey, event)).toBe(
                    mods.length === 4 && event.altKey && event.ctrlKey && event.metaKey && event.shiftKey,
                );
            });
        });
    });

    describe('non-strict', () => {
        test('alt', () => {
            const hotkey: Hotkey = {
                alt: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey);
            });
        });

        test('ctrl', () => {
            const hotkey: Hotkey = {
                ctrl: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.ctrlKey);
            });
        });

        test('meta', () => {
            const hotkey: Hotkey = {
                meta: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.metaKey);
            });
        });

        test('shift', () => {
            const hotkey: Hotkey = {
                shift: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.shiftKey);
            });
        });

        test('alt+ctrl', () => {
            const hotkey: Hotkey = {
                alt: true,
                ctrl: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.ctrlKey);
            });
        });

        test('alt+meta', () => {
            const hotkey: Hotkey = {
                alt: true,
                meta: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.metaKey);
            });
        });

        test('alt+shift', () => {
            const hotkey: Hotkey = {
                alt: true,
                shift: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.shiftKey);
            });
        });

        test('alt+ctrl+meta', () => {
            const hotkey: Hotkey = {
                alt: true,
                ctrl: true,
                meta: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.ctrlKey && event.metaKey);
            });
        });

        test('alt+ctrl+shift', () => {
            const hotkey: Hotkey = {
                alt: true,
                ctrl: true,
                shift: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.ctrlKey && event.shiftKey);
            });
        });

        test('alt+ctrl+meta+shift', () => {
            const hotkey: Hotkey = {
                alt: true,
                ctrl: true,
                meta: true,
                shift: true,
                nonStrict: true,
            };

            iterateModifiers((event: HotkeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(
                    event.altKey && event.ctrlKey && event.metaKey && event.shiftKey,
                );
            });
        });
    });
});

describe('isKeyMatching', () => {
    test('strict simple alphabet', () => {
        keys.forEach(key => {
            iterateModifiers(
                event => {
                    const hotkey: Hotkey = {
                        key: key.length !== 1 ? null : key,
                    };

                    const isMatching = isKeyMatching(hotkey, event);

                    expect(isMatching).toBe(hotkey.key == null || event.key.length === 1);
                },
                {
                    ...noModifiers,
                    key,
                },
            );
        });
    });

    test('non-strict simple alphabet', () => {
        keys.forEach(key => {
            iterateModifiers(
                event => {
                    const hotkey: Hotkey = {
                        key: key.length !== 1 ? null : key,
                        nonStrict: true,
                    };

                    const isMatching = isKeyMatching(hotkey, event);

                    expect(isMatching).toBe(hotkey.key == null || event.key.length === 1);
                },
                {
                    ...noModifiers,
                    key,
                },
            );
        });
    });
});
