import { HotKey } from '@zeroconf/keyboard-navigation/hotkeys/_parser';
import { isKeyMatching, isModifierMatching, HotKeyEvent } from '@zeroconf/keyboard-navigation/hotkeys/createHandler';

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

const noModifiers: HotKeyEvent = {
    altKey: false,
    ctrlKey: false,
    key: '',
    metaKey: false,
    shiftKey: false,
};

function iterateModifiers(
    fn: (event: HotKeyEvent, mods: Modifier[]) => void,
    current: HotKeyEvent = {
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
            const hotkey: HotKey = {
                alt: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 1 && event.altKey);
            });
        });

        test('ctrl', () => {
            const hotkey: HotKey = {
                ctrl: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 1 && event.ctrlKey);
            });
        });

        test('meta', () => {
            const hotkey: HotKey = {
                meta: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 1 && event.metaKey);
            });
        });

        test('shift', () => {
            const hotkey: HotKey = {
                shift: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 1 && event.shiftKey);
            });
        });

        test('alt+ctrl', () => {
            const hotkey: HotKey = {
                alt: true,
                ctrl: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 2 && event.altKey && event.ctrlKey);
            });
        });

        test('alt+meta', () => {
            const hotkey: HotKey = {
                alt: true,
                meta: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 2 && event.altKey && event.metaKey);
            });
        });

        test('alt+shift', () => {
            const hotkey: HotKey = {
                alt: true,
                shift: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(mods.length === 2 && event.altKey && event.shiftKey);
            });
        });

        test('alt+ctrl+meta', () => {
            const hotkey: HotKey = {
                alt: true,
                ctrl: true,
                meta: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(
                    mods.length === 3 && event.altKey && event.ctrlKey && event.metaKey,
                );
            });
        });

        test('alt+ctrl+shift', () => {
            const hotkey: HotKey = {
                alt: true,
                ctrl: true,
                shift: true,
                strict: true,
            };

            iterateModifiers((event: HotKeyEvent, mods: Modifier[]) => {
                expect(isModifierMatching(hotkey, event)).toBe(
                    mods.length === 3 && event.altKey && event.ctrlKey && event.shiftKey,
                );
            });
        });

        test('alt+ctrl+meta+shift', () => {
            const hotkey: HotKey = {
                alt: true,
                ctrl: true,
                meta: true,
                shift: true,
                strict: true,
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
            const hotkey: HotKey = {
                alt: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey);
            });
        });

        test('ctrl', () => {
            const hotkey: HotKey = {
                ctrl: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.ctrlKey);
            });
        });

        test('meta', () => {
            const hotkey: HotKey = {
                meta: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.metaKey);
            });
        });

        test('shift', () => {
            const hotkey: HotKey = {
                shift: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.shiftKey);
            });
        });

        test('alt+ctrl', () => {
            const hotkey: HotKey = {
                alt: true,
                ctrl: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.ctrlKey);
            });
        });

        test('alt+meta', () => {
            const hotkey: HotKey = {
                alt: true,
                meta: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.metaKey);
            });
        });

        test('alt+shift', () => {
            const hotkey: HotKey = {
                alt: true,
                shift: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.shiftKey);
            });
        });

        test('alt+ctrl+meta', () => {
            const hotkey: HotKey = {
                alt: true,
                ctrl: true,
                meta: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.ctrlKey && event.metaKey);
            });
        });

        test('alt+ctrl+shift', () => {
            const hotkey: HotKey = {
                alt: true,
                ctrl: true,
                shift: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
                expect(isModifierMatching(hotkey, event)).toBe(event.altKey && event.ctrlKey && event.shiftKey);
            });
        });

        test('alt+ctrl+meta+shift', () => {
            const hotkey: HotKey = {
                alt: true,
                ctrl: true,
                meta: true,
                shift: true,
            };

            iterateModifiers((event: HotKeyEvent) => {
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
                    const hotkey: HotKey = {
                        key: key.length !== 1 ? null : key,
                        strict: true,
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
                    const hotkey: HotKey = {
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
});
