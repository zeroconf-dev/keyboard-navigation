import { FocuserFn, FocuserType, TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';

const getSuccessFocuser = () => jest.fn().mockReturnValue(true);
const getNotFocuser = () => jest.fn().mockReturnValue(false);

describe('TabRegistry', () => {
    describe('TabRegistry.fromMap', () => {
        test('constructing linear structure', () => {
            const focuser: FocuserFn = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map<number, FocuserFn>([
                    [1, focuser],
                    [2, focuser],
                    [3, focuser],
                ]),
            );
            expect(Array.from(tr.keysRecursive())).toEqual([1, 2, 3]);
        });

        test('constructing complex structure', () => {
            const focuser: FocuserFn = getSuccessFocuser();
            // prettier-ignore
            const tr = TabRegistry.fromMap(
                new Map<number, any>([
                    [1, focuser],
                    [2, focuser],
                    [3, new Map<number, any>([
                        [31, focuser],
                        [32, new Map<number, any>([
                            [321, focuser],
                        ])],
                        [33, focuser],
                    ])],
                    [4, focuser],
                ]),
            );

            // prettier-ignore
            expect(Array.from(tr.keysRecursive())).toEqual([
                1,
                2,
                3,
                31,
                32,
                321,
                33,
                4,
            ]);
        });
    });

    describe('new ()', () => {
        test('constructing without parent registry does not fail', () => {
            const tr = new TabRegistry();
            expect(tr).toBeInstanceOf(TabRegistry);
        });

        test('constructing with parent registry', () => {
            const parentTr = new TabRegistry<number>();
            const tr = new TabRegistry<number>();
            expect(parentTr).toBeInstanceOf(TabRegistry);
            expect(tr).toBeInstanceOf(TabRegistry);
        });

        test('constructing with parent registry of different type parameter', () => {
            const parentTr = new TabRegistry<string>();
            const tr = new TabRegistry<number>();
            expect(parentTr).toBeInstanceOf(TabRegistry);
            expect(tr).toBeInstanceOf(TabRegistry);
        });
    });

    describe('.add()', () => {
        test('adding focuser to empty registry becomes both first and last', () => {
            const focuser = getSuccessFocuser();
            const tr = new TabRegistry<1>();
            tr.add(1, focuser);
            expect(focuser).not.toHaveBeenCalled();
            expect(tr.focusFirst()).toBe(true);
            expect(focuser).toHaveBeenCalledTimes(1);
            expect(tr.focusLast()).toBe(true);
            expect(focuser).toHaveBeenCalledTimes(2);
        });

        test('adding multiple focusers to the registry is ordered by insertion', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();

            const tr = new TabRegistry<number>();
            tr.add(1, focuser1);
            tr.add(2, focuser2);
            tr.add(3, focuser3);

            expect(focuser1).not.toHaveBeenCalled();
            expect(focuser2).not.toHaveBeenCalled();
            expect(focuser3).not.toHaveBeenCalled();

            expect(tr.focusFirst()).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).not.toHaveBeenCalled();
            expect(focuser3).not.toHaveBeenCalled();

            expect(tr.focusNext(1)).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).toHaveBeenCalledTimes(1);
            expect(focuser3).not.toHaveBeenCalled();

            expect(tr.focusNext(2)).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).toHaveBeenCalledTimes(1);
            expect(focuser3).toHaveBeenCalledTimes(1);
        });

        test('adding duplicate keys throws', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();

            const tr = new TabRegistry<number>();
            tr.add(1, focuser1);
            expect(() => tr.add(1, focuser2)).toThrowErrorMatchingSnapshot();
        });
    });

    describe('.addAfter()', () => {
        test('adding key between two other keys is ordered correctly', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();

            const tr = new TabRegistry<number>();
            tr.add(1, focuser1);
            tr.add(3, focuser3);

            expect(Array.from(tr.keysRecursive())).toEqual([1, 3]);

            tr.addAfter(2, focuser2, 1);

            expect(Array.from(tr.keysRecursive())).toEqual([1, 2, 3]);
        });

        test('adding key after last key, becomes the last key', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();

            const tr = new TabRegistry<number>();
            tr.add(1, focuser1);
            tr.add(2, focuser2);

            expect(Array.from(tr.keysRecursive())).toEqual([1, 2]);
            tr.addAfter(3, focuser3, 2);

            expect(Array.from(tr.keysRecursive())).toEqual([1, 2, 3]);

            expect(focuser1).not.toHaveBeenCalled();
            expect(focuser2).not.toHaveBeenCalled();
            expect(focuser3).not.toHaveBeenCalled();

            expect(tr.focusLast()).toBe(true);

            expect(focuser1).not.toHaveBeenCalled();
            expect(focuser2).not.toHaveBeenCalled();
            expect(focuser3).toHaveBeenCalledTimes(1);
        });

        test('adding duplicate keys throws', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();

            const tr = new TabRegistry<number>();
            tr.add(1, focuser1);
            expect(() => tr.addAfter(1, focuser2, 1)).toThrowErrorMatchingSnapshot();
        });

        test('adding a child registry sets parent', () => {
            const focuser = getSuccessFocuser();
            const parentRegistry = TabRegistry.fromMap(new Map([['focuser', focuser]]));
            const tr = TabRegistry.empty();
            parentRegistry.addAfter('child', tr, 'focuser');
            expect(tr.parentRegistry).toBe(parentRegistry);
        });
    });

    describe('.addBefore()', () => {
        test('adding key between two other keys is ordered correctly', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();

            const tr = new TabRegistry<number>();
            tr.add(1, focuser1);
            tr.add(3, focuser3);

            expect(Array.from(tr.keysRecursive())).toEqual([1, 3]);

            tr.addBefore(2, focuser2, 3);

            expect(Array.from(tr.keysRecursive())).toEqual([1, 2, 3]);
        });

        test('adding key before first key, becomes the first key', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();

            const tr = new TabRegistry<number>();
            tr.add(2, focuser2);
            tr.add(3, focuser3);

            expect(Array.from(tr.keysRecursive())).toEqual([2, 3]);
            tr.addBefore(1, focuser1, 2);

            expect(Array.from(tr.keysRecursive())).toEqual([1, 2, 3]);

            expect(focuser1).not.toHaveBeenCalled();
            expect(focuser2).not.toHaveBeenCalled();
            expect(focuser3).not.toHaveBeenCalled();

            expect(tr.focusFirst()).toBe(true);

            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).not.toHaveBeenCalled();
            expect(focuser3).not.toHaveBeenCalled();
        });

        test('adding duplicate keys throws', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();

            const tr = new TabRegistry<number>();
            tr.add(1, focuser1);
            expect(() => tr.addBefore(1, focuser2, 1)).toThrowErrorMatchingSnapshot();
        });

        test('adding a child registry sets parent', () => {
            const focuser = getSuccessFocuser();
            const parentRegistry = TabRegistry.fromMap(new Map([['focuser', focuser]]));
            const tr = TabRegistry.empty();
            parentRegistry.addBefore('child', tr, 'focuser');
            expect(tr.parentRegistry).toBe(parentRegistry);
        });
    });

    describe('.delete()', () => {
        test(`deleting a key that doesn't exist throws`, () => {
            const tr = new TabRegistry<number>();
            expect(() => tr.delete(1)).toThrowErrorMatchingSnapshot();
        });

        test('deleting a key removes it from the registry', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser],
                    [2, focuser],
                ]),
            );
            expect(tr.has(1)).toBe(true);
            tr.delete(1);
            expect(tr.has(1)).toBe(false);
        });

        test('deleting the first key, will assign the next in line as first', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                    [3, focuser3],
                ]),
            );

            expect(focuser1).not.toHaveBeenCalled();
            tr.focusFirst();
            expect(focuser1).toHaveBeenCalledTimes(1);

            expect(focuser2).not.toHaveBeenCalled();
            tr.delete(1);
            tr.focusFirst();
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).toHaveBeenCalledTimes(1);
        });

        test('deleting the last key, will assign the next in line as last', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                    [3, focuser3],
                ]),
            );

            expect(focuser3).not.toHaveBeenCalled();
            tr.focusLast();
            expect(focuser3).toHaveBeenCalledTimes(1);

            expect(focuser2).not.toHaveBeenCalled();
            tr.delete(3);
            tr.focusLast();
            expect(focuser3).toHaveBeenCalledTimes(1);
            expect(focuser2).toHaveBeenCalledTimes(1);
        });
    });

    describe('.disableCycle()', () => {
        test("disabling boundry cycle, after constructing a registry will won't cycle", () => {
            const cycleFocuser1 = getSuccessFocuser();
            const cycleFocuser2 = getSuccessFocuser();
            const nonCycleFocuser1 = getSuccessFocuser();
            const nonCycleFocuser2 = getSuccessFocuser();

            const cycleRegistry = TabRegistry.fromMap(
                new Map([
                    [1, cycleFocuser1],
                    [2, cycleFocuser2],
                ]),
                {
                    cycle: true,
                },
            );
            const nonCycleRegistry = TabRegistry.fromMap(
                new Map([
                    [1, nonCycleFocuser1],
                    [2, nonCycleFocuser2],
                ]),
                {
                    cycle: true,
                },
            ).disableCycle();

            expect(cycleRegistry.focusNext(2));
            expect(cycleFocuser1).toHaveBeenCalledTimes(1);
            expect(cycleFocuser2).not.toHaveBeenCalled();

            expect(nonCycleRegistry.focusNext(2));
            expect(nonCycleFocuser1).not.toHaveBeenCalled();
            expect(nonCycleFocuser2).not.toHaveBeenCalled();
        });
    });

    describe('.enableCycle()', () => {
        test('enabling boundry cycle, after constructing a registry will cycle boundries', () => {
            const cycleFocuser1 = getSuccessFocuser();
            const cycleFocuser2 = getSuccessFocuser();
            const nonCycleFocuser1 = getSuccessFocuser();
            const nonCycleFocuser2 = getSuccessFocuser();

            const cycleRegistry = TabRegistry.fromMap(
                new Map([
                    [1, cycleFocuser1],
                    [2, cycleFocuser2],
                ]),
            ).enableCycle();
            const nonCycleRegistry = TabRegistry.fromMap(
                new Map([
                    [1, nonCycleFocuser1],
                    [2, nonCycleFocuser2],
                ]),
            );

            expect(cycleRegistry.focusNext(2));
            expect(cycleFocuser1).toHaveBeenCalledTimes(1);
            expect(cycleFocuser2).not.toHaveBeenCalled();

            expect(nonCycleRegistry.focusNext(2));
            expect(nonCycleFocuser1).not.toHaveBeenCalled();
            expect(nonCycleFocuser2).not.toHaveBeenCalled();
        });
    });

    describe('.focus()', () => {
        test("focusing a key that doesn't exist returns false", () => {
            const tr = new TabRegistry<number>();
            expect(tr.focus(1)).toBe(false);
        });

        test('focusing a key that exists will execute the focuser and return the focusers return value', () => {
            const successFocuser = getSuccessFocuser();
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    ['focus', successFocuser],
                    ['not-focus', notFocuser],
                ]),
            );

            expect(tr.focus('focus')).toBe(true);
            expect(tr.focus('not-focus')).toBe(false);
        });

        test('empty focus call on empty registry returns false', () => {
            const tr = TabRegistry.empty();
            expect(tr.focus()).toBe(false);
        });

        test('focus with child origin will focus parent registry if enabled', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.empty({
                focusParentOnChildOrigin: true,
            });

            TabRegistry.fromMap(
                new Map([
                    ['focuser', focuser],
                    ['complex', tr as any],
                ]),
            );
            tr.focus(undefined, { focusOrigin: 'child' });

            expect(focuser).toHaveBeenCalled();
        });
    });

    describe('.focusFirst()', () => {
        test('focus first on an empty registry returns false', () => {
            const tr = new TabRegistry();
            expect(tr.focusFirst()).toBe(false);
        });

        test('focusing a key that exists returns what the focuser returns', () => {
            const successFocuser = getSuccessFocuser();
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    ['focus', successFocuser],
                    ['not-focus', notFocuser],
                ]),
            );

            expect(tr.focusFirst()).toBe(true);
            expect(successFocuser).toHaveBeenCalledTimes(1);
            tr.delete('focus');
            expect(tr.focusFirst()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(1);
        });

        test('focusing a key that returns false, executes next focuser, stop on success and return true', () => {
            const successFocuser = getSuccessFocuser();
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, notFocuser],
                    [2, successFocuser],
                ]),
            );
            expect(tr.focusFirst()).toBe(true);
            expect(notFocuser).toHaveBeenCalledTimes(1);
            expect(successFocuser).toHaveBeenCalledTimes(1);
        });

        test('a set with only *not* focuser, will run through the whole set and return false', () => {
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, notFocuser],
                    [2, notFocuser],
                    [3, notFocuser],
                    [4, notFocuser],
                ]),
            );

            expect(tr.focusFirst()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(4);
        });

        test('a set with only *not* focuser will return even if cycle is enabled', () => {
            const notFocuser = getNotFocuser();
            // prettier-ignore
            const tr = TabRegistry.fromMap(new Map([
                [1, notFocuser],
                [2, notFocuser],
                [3, notFocuser],
                [4, notFocuser],
            ])).enableCycle();

            expect(tr.focusFirst()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(4);
        });

        test('recurse if first focuser is another registry', () => {
            const focuser = getSuccessFocuser();

            // prettier-ignore
            const tr = TabRegistry.fromMap(new Map([
                [1, new Map([
                    [2, focuser],
                ])],
            ]));

            tr.focusFirst();
            expect(focuser).toHaveBeenCalled();
        });
    });

    describe('.focusFirstIn()', () => {
        test("focus nested registry that doesn't exist will return false", () => {
            const tr = new TabRegistry<number>();
            expect(tr.focusIn([2])).toBe(false);
        });

        test('focus an existing first level non-success focuser will return false', () => {
            const focuser = getNotFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusIn([1])).toBe(false);
        });

        test('focus a tab registry as leaf will focus the first focuser in the registry', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                ]),
            );
            const parentTr = TabRegistry.fromMap(new Map([[1, tr]]));
            expect(focuser1).not.toHaveBeenCalled();
            expect(parentTr.focusIn([1])).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).not.toHaveBeenCalled();
        });

        test('focus a deeply nested registry', () => {
            const focuser = getSuccessFocuser();
            const tr5 = TabRegistry.fromMap(new Map([[1, focuser]]));
            const tr4 = TabRegistry.fromMap(
                new Map<number, FocuserType>([
                    [1, focuser],
                    [2, tr5],
                ]),
            );
            const tr3 = TabRegistry.fromMap(
                new Map<number, FocuserType>([
                    [1, focuser],
                    [2, tr4],
                ]),
            );
            const tr2 = TabRegistry.fromMap(
                new Map<number, FocuserType>([
                    [1, focuser],
                    [2, tr3],
                ]),
            );
            const tr1 = TabRegistry.fromMap(new Map<number, FocuserType>([[1, tr2]]));

            expect(tr1.focusFirstIn([2, 2, 2, 1])).toBe(true);
            expect(focuser).toHaveBeenCalledTimes(1);
        });

        test('focus on empty registry returns false', () => {
            const tr = TabRegistry.empty();
            expect(tr.focusFirstIn([1])).toBe(false);
        });
    });

    describe('.focusIn()', () => {
        test("focus nested registry that doesn't exist will return false", () => {
            const tr = new TabRegistry<number>();
            expect(tr.focusIn([1, 2])).toBe(false);
        });

        test('focus an existing first level success focuser will return true', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusIn([1])).toBe(true);
        });

        test('focus an existing first level non-success focuser will return false', () => {
            const focuser = getNotFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusIn([1])).toBe(false);
        });

        test('focus a tab registry as leaf will focus the first focuser in the registry', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                ]),
            );
            const parentTr = TabRegistry.fromMap(new Map([[1, tr]]));
            expect(focuser1).not.toHaveBeenCalled();
            expect(parentTr.focusIn([1])).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).not.toHaveBeenCalled();
        });

        test('focus a deeply nested registry', () => {
            const focuser = getSuccessFocuser();
            const tr5 = TabRegistry.fromMap(new Map([[1, focuser]]));
            const tr4 = TabRegistry.fromMap(
                new Map<number, FocuserFn | TabRegistry<number>>([
                    [1, focuser],
                    [2, tr5],
                ]),
            );
            const tr3 = TabRegistry.fromMap(
                new Map<number, FocuserFn | TabRegistry<number>>([
                    [1, focuser],
                    [2, tr4],
                ]),
            );
            const tr2 = TabRegistry.fromMap(
                new Map<number, FocuserFn | TabRegistry<number>>([
                    [1, focuser],
                    [2, tr3],
                ]),
            );
            const tr1 = TabRegistry.fromMap(
                new Map<number, FocuserFn | TabRegistry<number>>([
                    [1, focuser],
                    [2, tr2],
                ]),
            );

            expect(tr1.focusIn([2, 2, 2, 2, 1])).toBe(true);
            expect(focuser).toHaveBeenCalledTimes(1);
        });

        test('attempting to focus into/beyond simple focuser returns flase', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([['focuser', focuser]]));
            expect(tr.focusIn(['focuser', 'non-existing-next-level'])).toBe(false);
            expect(focuser).not.toHaveBeenCalled();
        });

        test('focusing on empty path/keys returns false', () => {
            const tr = TabRegistry.empty();
            expect(tr.focusIn([])).toBe(false);
        });
    });

    describe('.focusNext()', () => {
        test("focus next to a key that doesn't exist throws", () => {
            const tr = TabRegistry.empty();
            expect(() => tr.focusNext(1)).toThrowErrorMatchingSnapshot();
        });

        test('focus next of last key returns false', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusNext(1)).toBe(false);
            expect(focuser).not.toHaveBeenCalled();
        });

        test('focus next to a key where no successful focusers are left returns false', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getNotFocuser();
            const focuser3 = getNotFocuser();
            const focuser4 = getNotFocuser();

            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                    [3, focuser3],
                    [4, focuser4],
                ]),
            );

            expect(tr.focusNext(1)).toBe(false);
            expect(focuser1).not.toHaveBeenCalled();
            expect(focuser2).toHaveBeenCalledTimes(1);
            expect(focuser3).toHaveBeenCalledTimes(1);
            expect(focuser4).toHaveBeenCalledTimes(1);
        });

        test('focus next to a key where no successful focusers are left where cycle is enabled returns', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getNotFocuser();
            const focuser3 = getNotFocuser();
            const focuser4 = getNotFocuser();

            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                    [3, focuser3],
                    [4, focuser4],
                ]),
            ).enableCycle();

            expect(tr.focusNext(1)).toBe(true);
            expect(focuser2).toHaveBeenCalledTimes(1);
            expect(focuser3).toHaveBeenCalledTimes(1);
            expect(focuser4).toHaveBeenCalledTimes(1);
            expect(focuser1).toHaveBeenCalledTimes(1);
        });

        test('when cycling all disabled focusers, does not infinitely recurse, but just returns false', () => {
            const disabled = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    ['disabled1', disabled],
                    ['disabled2', disabled],
                ]),
                {
                    cycle: true,
                },
            );
            expect(tr.focusNext('disabled2')).toBe(false);
        });
    });

    describe('.focusNextIn()', () => {
        test('the first key is skipped and the is used as path', () => {
            const row1Input = getSuccessFocuser();
            const row2Input = getSuccessFocuser();
            const row1Button = getSuccessFocuser();
            const row2Button = getSuccessFocuser();

            // prettier-ignore
            const rowRegistry1 = TabRegistry.fromMap(new Map([
                ['input', row1Input],
                ['button', row1Button],
            ]));

            // prettier-ignore
            const rowRegistry2 = TabRegistry.fromMap(new Map([
                ['input', row2Input],
                ['button', row2Button],
            ]));

            // prettier-ignore
            const complexEditor = TabRegistry.fromMap(new Map([
                ['row1', rowRegistry1],
                ['row2', rowRegistry2],
            ]));

            // prettier-ignore
            expect(complexEditor.focusNextIn([
                'row1',
                'button',
            ])).toBe(true);

            expect(row1Input).not.toHaveBeenCalled();
            expect(row1Button).not.toHaveBeenCalled();
            expect(row2Input).not.toHaveBeenCalled();
            expect(row2Button).toHaveBeenCalledTimes(1);
        });

        test('return false if keys path is empty', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusNextIn([])).toBe(false);
        });

        test('when first key in does not exist throws', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(() => tr.focusNextIn([2])).toThrowErrorMatchingSnapshot();
        });

        test('when key beyond first level returns false', () => {
            const row1Input = getSuccessFocuser();
            const row2Input = getSuccessFocuser();
            const row1Button = getSuccessFocuser();
            const row2Button = getSuccessFocuser();

            // prettier-ignore
            const rowRegistry1 = TabRegistry.fromMap(new Map([
                ['input', row1Input],
                ['button', row1Button],
            ]));

            // prettier-ignore
            const rowRegistry2 = TabRegistry.fromMap(new Map([
                ['input', row2Input],
                ['button', row2Button],
            ]));

            // prettier-ignore
            const complexEditor = TabRegistry.fromMap(new Map([
                ['row1', rowRegistry1],
                ['row2', rowRegistry2],
            ]));

            // prettier-ignore
            expect(complexEditor.focusNextIn([
                'row1',
                'non-existing',
            ])).toBe(false);

            // prettier-ignore
            expect(complexEditor.focusNextIn([
                'row1',
                'non-existing2',
                'non-existing-next-level',
            ])).toBe(false);
        });

        test('when leaf key is a registry it is called with the origin of prev', () => {
            const row1Input = getSuccessFocuser();
            const row2Input = getSuccessFocuser();
            const row1EditButton = getSuccessFocuser();
            const row2EditButton = getSuccessFocuser();
            const row1DeleteButton = getSuccessFocuser();
            const row2DeleteButton = getSuccessFocuser();

            // prettier-ignore
            const row1ControlRow = TabRegistry.fromMap(new Map([
                ['edit-button', row1EditButton],
                ['delete-button', row1DeleteButton],
            ]));

            // prettier-ignore
            const row2ControlRow = TabRegistry.fromMap(new Map([
                ['edit-button', row2EditButton],
                ['delete-button', row2DeleteButton],
            ]));

            // prettier-ignore
            const rowRegistry1 = TabRegistry.fromMap(new Map<string, FocuserType>([
                ['input', row1Input],
                ['control-row', row1ControlRow],
            ]));

            // prettier-ignore
            const rowRegistry2 = TabRegistry.fromMap(new Map<string, FocuserType>([
                ['input', row2Input],
                ['control-row', row2ControlRow],
            ]));

            // prettier-ignore
            const complexEditor = TabRegistry.fromMap(new Map([
                ['row1', rowRegistry1],
                ['row2', rowRegistry2],
            ]));

            // prettier-ignore
            expect(complexEditor.focusNextIn([
                'row1',
                'control-row',
            ])).toBe(true);

            expect(row2EditButton).toHaveBeenCalledWith({ focusOrigin: 'prev' });
        });

        test('test when nothing is next false is returned', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([['first', focuser]]));
            expect(tr.focusNextIn(['first'])).toBe(false);
        });
    });

    describe('.focusLast()', () => {
        test('focusing a key that exists returns what the focuser returns', () => {
            const successFocuser = getSuccessFocuser();
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    ['not-focus', notFocuser],
                    ['focus', successFocuser],
                ]),
            );

            expect(tr.focusLast()).toBe(true);
            expect(successFocuser).toHaveBeenCalledTimes(1);
            tr.delete('focus');
            expect(tr.focusLast()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(1);
        });

        test('focusing a key that returns false, executes next focuser, stop on success and return true', () => {
            const successFocuser = getSuccessFocuser();
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, successFocuser],
                    [2, notFocuser],
                ]),
            );
            expect(tr.focusLast()).toBe(true);
            expect(notFocuser).toHaveBeenCalledTimes(1);
            expect(successFocuser).toHaveBeenCalledTimes(1);
        });

        test('a set with only *not* focuser, will run through the whole set and return false', () => {
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, notFocuser],
                    [2, notFocuser],
                    [3, notFocuser],
                    [4, notFocuser],
                ]),
            );

            expect(tr.focusLast()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(4);
        });

        test('a set with only *not* focuser will return even if cycle is enabled', () => {
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, notFocuser],
                    [2, notFocuser],
                    [3, notFocuser],
                    [4, notFocuser],
                ]),
            ).enableCycle();

            expect(tr.focusLast()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(4);
        });

        test('calling on empty registry returns false', () => {
            const tr = TabRegistry.empty();
            expect(tr.focusLast()).toBe(false);
        });

        test('focus last where last is another registry will focus last in inner registry', () => {
            const notFocuser = getNotFocuser();
            const focuser = getSuccessFocuser();
            // prettier-ignore
            const tr = TabRegistry.fromMap(
                new Map<number, FocuserType>([
                    [1, notFocuser],
                    [2, TabRegistry.fromMap(new Map<number, FocuserType>([
                        [3, focuser],
                    ]))],
                ]),
            );
            expect(tr.focusLast()).toBe(true);
            expect(focuser).toHaveBeenCalled();
            expect(notFocuser).not.toHaveBeenCalled();
        });
    });

    describe('.focusLastIn()', () => {
        test('focusing last-in when leaf is a registry the last focuser in that registry is executed', () => {
            const row1Input = getSuccessFocuser();
            const row2Input = getSuccessFocuser();
            const row1EditButton = getSuccessFocuser();
            const row2EditButton = getSuccessFocuser();
            const row1DeleteButton = getSuccessFocuser();
            const row2DeleteButton = getSuccessFocuser();

            // prettier-ignore
            const row1ControlRow = TabRegistry.fromMap(new Map([
                ['edit-button', row1EditButton],
                ['delete-button', row1DeleteButton],
            ]));

            // prettier-ignore
            const row2ControlRow = TabRegistry.fromMap(new Map([
                ['edit-button', row2EditButton],
                ['delete-button', row2DeleteButton],
            ]));

            // prettier-ignore
            const rowRegistry1 = TabRegistry.fromMap(new Map<string, FocuserType>([
                ['input', row1Input],
                ['control-row', row1ControlRow],
            ]));

            // prettier-ignore
            const rowRegistry2 = TabRegistry.fromMap(new Map<string, FocuserType>([
                ['input', row2Input],
                ['control-row', row2ControlRow],
            ]));

            // prettier-ignore
            const complexEditor = TabRegistry.fromMap(new Map([
                ['row1', rowRegistry1],
                ['row2', rowRegistry2],
            ]));

            expect(complexEditor.focusLastIn(['control-row'])).toBe(true);
            expect(row2DeleteButton).toHaveBeenCalledWith({ focusOrigin: 'next' });
        });

        test('calling on empty registry returns false', () => {
            const tr = new TabRegistry();
            expect(tr.focusLastIn(['non-existing'])).toBe(false);
        });
    });

    describe('.focusPrev()', () => {
        test("focus prev of a key that doesn't exist throws", () => {
            const tr = TabRegistry.empty();
            expect(() => tr.focusPrev(1)).toThrowErrorMatchingSnapshot();
        });

        test('focus prev of last key returns false', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusPrev(1)).toBe(false);
            expect(focuser).not.toHaveBeenCalled();
        });

        test('focus prev of a key where no successful focusers are left returns false', () => {
            const focuser1 = getNotFocuser();
            const focuser2 = getNotFocuser();
            const focuser3 = getNotFocuser();
            const focuser4 = getSuccessFocuser();

            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                    [3, focuser3],
                    [4, focuser4],
                ]),
            );

            expect(tr.focusPrev(4)).toBe(false);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).toHaveBeenCalledTimes(1);
            expect(focuser3).toHaveBeenCalledTimes(1);
            expect(focuser4).not.toHaveBeenCalled();
        });

        test('focus prev of a key where no successful focusers are left where cycle is enabled returns', () => {
            const focuser1 = getNotFocuser();
            const focuser2 = getNotFocuser();
            const focuser3 = getNotFocuser();
            const focuser4 = getSuccessFocuser();

            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                    [3, focuser3],
                    [4, focuser4],
                ]),
            ).enableCycle();

            expect(tr.focusPrev(4)).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).toHaveBeenCalledTimes(1);
            expect(focuser3).toHaveBeenCalledTimes(1);
            expect(focuser4).toHaveBeenCalledTimes(1);
        });

        test('when cycling all disabled focusers, does not end in infinitely recurse, but just returns false', () => {
            const disabled = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    ['disabled1', disabled],
                    ['disabled2', disabled],
                ]),
                {
                    cycle: true,
                },
            );
            expect(tr.focusPrev('disabled1')).toBe(false);
        });
    });

    describe('.focusPrevIn()', () => {
        test('the last key is skipped and the rest is used as path', () => {
            const row1Input = getSuccessFocuser();
            const row2Input = getSuccessFocuser();
            const row1Button = getSuccessFocuser();
            const row2Button = getSuccessFocuser();

            // prettier-ignore
            const rowRegistry1 = TabRegistry.fromMap(new Map([
                ['input', row1Input],
                ['button', row1Button],
            ]));

            // prettier-ignore
            const rowRegistry2 = TabRegistry.fromMap(new Map([
                ['input', row2Input],
                ['button', row2Button],
            ]));

            // prettier-ignore
            const complexEditor = TabRegistry.fromMap(new Map([
                ['row1', rowRegistry1],
                ['row2', rowRegistry2],
            ]));

            // prettier-ignore
            expect(complexEditor.focusPrevIn([
                'row2',
                'button',
            ])).toBe(true);

            expect(row1Input).not.toHaveBeenCalled();
            expect(row1Button).toHaveBeenCalledTimes(1);
            expect(row2Input).not.toHaveBeenCalled();
            expect(row2Button).not.toHaveBeenCalled();
        });

        test('return false if keys path is empty', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusPrevIn([])).toBe(false);
        });

        test('when first key in does not exist throws', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(() => tr.focusPrevIn([2])).toThrowErrorMatchingSnapshot();
        });

        test('when key beyond first level returns false', () => {
            const row1Input = getSuccessFocuser();
            const row2Input = getSuccessFocuser();
            const row1Button = getSuccessFocuser();
            const row2Button = getSuccessFocuser();

            // prettier-ignore
            const rowRegistry1 = TabRegistry.fromMap(new Map([
                ['input', row1Input],
                ['button', row1Button],
            ]));

            // prettier-ignore
            const rowRegistry2 = TabRegistry.fromMap(new Map([
                ['input', row2Input],
                ['button', row2Button],
            ]));

            // prettier-ignore
            const complexEditor = TabRegistry.fromMap(new Map([
                ['row1', rowRegistry1],
                ['row2', rowRegistry2],
            ]));

            // prettier-ignore
            expect(complexEditor.focusPrevIn([
                'row2',
                'non-existing',
            ])).toBe(false);

            // prettier-ignore
            expect(complexEditor.focusPrevIn([
                'row2',
                'non-existing2',
                'non-existing-next-level',
            ])).toBe(false);
        });

        test('when leaf key is a registry it is called with the origin of prev', () => {
            const row1Input = getSuccessFocuser();
            const row2Input = getSuccessFocuser();
            const row1EditButton = getSuccessFocuser();
            const row2EditButton = getSuccessFocuser();
            const row1DeleteButton = getSuccessFocuser();
            const row2DeleteButton = getSuccessFocuser();

            // prettier-ignore
            const row1ControlRow = TabRegistry.fromMap(new Map([
                ['edit-button', row1EditButton],
                ['delete-button', row1DeleteButton],
            ]));

            // prettier-ignore
            const row2ControlRow = TabRegistry.fromMap(new Map([
                ['edit-button', row2EditButton],
                ['delete-button', row2DeleteButton],
            ]));

            // prettier-ignore
            const rowRegistry1 = TabRegistry.fromMap(new Map<string, FocuserType>([
                ['input', row1Input],
                ['control-row', row1ControlRow],
            ]));

            // prettier-ignore
            const rowRegistry2 = TabRegistry.fromMap(new Map<string, FocuserType>([
                ['input', row2Input],
                ['control-row', row2ControlRow],
            ]));

            // prettier-ignore
            const complexEditor = TabRegistry.fromMap(new Map([
                ['row1', rowRegistry1],
                ['row2', rowRegistry2],
            ]));

            // prettier-ignore
            expect(complexEditor.focusPrevIn([
                'row2',
                'control-row',
            ])).toBe(true);

            expect(row1DeleteButton).toHaveBeenCalledWith({ focusOrigin: 'next' });
        });

        test('test when nothing is previous false is returned', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([['first', focuser]]));
            expect(tr.focusPrevIn(['first'])).toBe(false);
        });
    });

    describe('.get()', () => {
        test('getting a focuser of a key that exists should return that focuser', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.get(1)).toBe(focuser);
        });

        test('getting a focuser of a key that does not exists should return null', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.get(2)).toBe(null);
        });
    });

    describe('.getNext()', () => {
        test('getting a focuser next to a key that exists should return that focuser', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                ]),
            );
            expect(tr.getNext(1)).toBe(focuser2);
        });

        test('getting a focuser next to a key that does not exists should throw', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(() => tr.getNext(2)).toThrowErrorMatchingSnapshot();
        });

        test('getting a focuser next to a key of the last returns false', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.getNext(1)).toBe(null);
        });
    });

    describe('.getPrev()', () => {
        test('getting a focuser prev to a key that exists should return that focuser', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser1],
                    [2, focuser2],
                ]),
            );
            expect(tr.getPrev(2)).toBe(focuser1);
        });

        test('getting a focuser prev to a key that does not exists should throw', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(() => tr.getPrev(2)).toThrowErrorMatchingSnapshot();
        });

        test('getting a focuser prev of the first key returns false', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.getPrev(1)).toBe(null);
        });
    });

    describe('.has()', () => {
        test('when key exists it returns true', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.has(1)).toBe(true);
        });

        test('when key does not exist it returns false', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[2, focuser]]));
            expect(tr.has(1)).toBe(false);
        });
    });

    describe('.hasIn()', () => {
        test('focusing in complex editor where key exists, return true', () => {
            const focuser = getSuccessFocuser();

            // prettier-ignore
            const row1ControlRow = TabRegistry.fromMap(new Map([
                ['edit-button', focuser],
                ['delete-button', focuser],
            ]));

            // prettier-ignore
            const row2ControlRow = TabRegistry.fromMap(new Map([
                ['edit-button', focuser],
                ['delete-button', focuser],
            ]));

            // prettier-ignore
            const rowRegistry1 = TabRegistry.fromMap(new Map<string, FocuserType>([
                ['input', focuser],
                ['control-row', row1ControlRow],
            ]));

            // prettier-ignore
            const rowRegistry2 = TabRegistry.fromMap(new Map<string, FocuserType>([
                ['input', focuser],
                ['control-row', row2ControlRow],
            ]));

            // prettier-ignore
            const complexEditor = TabRegistry.fromMap(new Map([
                ['row1', rowRegistry1],
                ['row2', rowRegistry2],
            ]));

            // prettier-ignore
            expect(complexEditor.hasIn([
                'row1',
                'control-row',
                'delete-button',
            ])).toBe(true);
        });

        test("focusing a complex path that doesn't exist return false", () => {
            const focuser = getSuccessFocuser();
            // prettier-ignore
            const tr = TabRegistry.fromMap(new Map([
                [1, focuser],
            ]));
            expect(tr.hasIn([1, 2, 3])).toBe(false);
        });

        test('asking for non-existing path returns false', () => {
            const tr = new TabRegistry();
            expect(tr.hasIn(['non-existing'])).toBe(false);
        });

        test('asking with empty path returns false', () => {
            const tr = new TabRegistry();
            expect(tr.hasIn([])).toBe(false);
        });
    });

    describe('.hasNext()', () => {
        test('has next returns false if key does not exist', () => {
            const tr = TabRegistry.empty();
            expect(tr.hasNext(1)).toBe(false);
        });

        test('has next returns false if called on last key', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.hasNext(1)).toBe(false);
        });

        test('has next returns true if next of key exists', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser],
                    [2, focuser],
                ]),
            );
            expect(tr.hasNext(1)).toBe(true);
        });
    });

    describe('.hasPrev()', () => {
        test('has prev returns false if key does not exist', () => {
            const tr = TabRegistry.empty();
            expect(tr.hasPrev(1)).toBe(false);
        });

        test('has prev returns false if called on first key', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.hasPrev(1)).toBe(false);
        });

        test('has prev returns true if next of key exists', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser],
                    [2, focuser],
                ]),
            );
            expect(tr.hasPrev(2)).toBe(true);
        });
    });

    describe('.moveNext()', () => {
        test('moving the last key has no effect', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser],
                    [2, focuser],
                    [3, focuser],
                ]),
            );
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
            tr.moveNext(3);
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
        });

        test("moving a key that doesn't exist throws", () => {
            const tr = new TabRegistry<number>();
            expect(() => tr.moveNext(1)).toThrowErrorMatchingSnapshot();
        });

        test('moving a key actually moves the key in the registry', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser],
                    [3, focuser],
                    [2, focuser],
                ]),
            );
            expect(Array.from(tr.keys())).toEqual([1, 3, 2]);
            tr.moveNext(3);
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
        });
    });

    describe('.movePrev()', () => {
        test('moving the first key has no effect', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [1, focuser],
                    [2, focuser],
                    [3, focuser],
                ]),
            );
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
            tr.movePrev(1);
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
        });

        test("moving a key that doesn't exist throws", () => {
            const tr = new TabRegistry<number>();
            expect(() => tr.movePrev(1)).toThrowErrorMatchingSnapshot();
        });

        test('moving a key actually moves the key in the registry', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    [2, focuser],
                    [1, focuser],
                    [3, focuser],
                ]),
            );
            expect(Array.from(tr.keys())).toEqual([2, 1, 3]);
            tr.movePrev(1);
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
        });
    });

    describe('.set()', () => {
        test('setting a focuser where key does not exist throws', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(() => tr.set(2, focuser)).toThrowErrorMatchingSnapshot();
        });

        test('setting a focuser where key exists, overwrites the existing focuser', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser1]]));

            expect(tr.get(1)).toBe(focuser1);
            expect(tr.get(1)).not.toBe(focuser2);
            tr.set(1, focuser2);
            expect(tr.get(1)).toBe(focuser2);
            expect(tr.get(1)).not.toBe(focuser1);
        });
    });

    describe('.toString()', () => {
        test('complex registries get outputter correctly', () => {
            const focuser: FocuserFn = getSuccessFocuser();
            // prettier-ignore
            const tr = TabRegistry.fromMap(
                new Map<number, any>([
                    [1, focuser],
                    [2, focuser],
                    [3, new Map<number, any>([
                        [31, focuser],
                        [32, new Map<number, any>([
                            [321, focuser],
                        ])],
                        [33, focuser],
                    ])],
                    [4, focuser],
                ]),
            );

            expect(tr.toString()).toBe(
                'TabRegistry[\n' +
                    '    1,\n' +
                    '    2,\n' +
                    '        31,\n' +
                    '            321,\n' +
                    '        33,\n' +
                    '    4\n' +
                    ']',
            );
        });
    });

    describe('.parentRegistry', () => {
        test('returning null when no parent is set', () => {
            const tr = new TabRegistry<number>();
            expect(tr.parentRegistry).toBeNull();
        });

        test('returning parent registry when one is set', () => {
            const tr = new TabRegistry<number>();
            const parentTr = new TabRegistry<number>();
            tr.setParentRegistry(0, parentTr);
            expect(tr.parentRegistry).toBe(parentTr);
        });
    });

    describe('.focusParent()', () => {
        test('trying to focus parent, when no parent is set should return false', () => {
            const tr = new TabRegistry<number>();
            expect(tr.focusParent()).toBe(false);
        });

        test('trying to focus parent should return value of parent first child focuser', () => {
            const parentTr = new TabRegistry<number>();
            const tr = new TabRegistry<number>();

            const focuser1 = getSuccessFocuser();
            const focuser2 = getNotFocuser();

            parentTr.add(0, focuser1);
            parentTr.add(1, tr);

            expect(tr.focusParent()).toBe(true);

            parentTr.delete(0);
            parentTr.add(0, focuser2);

            expect(tr.focusParent()).toBe(false);
        });

        test('parent focuser is called with child origin', () => {
            const parentTr = new TabRegistry<number>();
            const tr = new TabRegistry<number>();

            const focuser1 = getSuccessFocuser();

            parentTr.add(0, focuser1);
            parentTr.add(1, tr);

            tr.focusParent();

            expect(focuser1).toHaveBeenCalledWith({ focusOrigin: 'child' });
        });
    });

    describe('.keys()', () => {
        test('iterating over empty registry does not produce any values', () => {
            const tr = TabRegistry.empty();
            expect(Array.from(tr.keys())).toHaveLength(0);
        });
    });

    describe('Symbol.iterator', () => {
        test('...spread a registry into an array', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();
            const focuser4 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(
                new Map([
                    ['focuser1', focuser1],
                    ['focuser2', focuser2],
                    ['focuser3', focuser3],
                    ['focuser4', focuser4],
                ]),
            );

            const focusers = [...tr];

            expect(focusers).toHaveLength(4);
        });

        test('...spreading nested registries flattens the result', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();
            const focuser4 = getSuccessFocuser();
            // prettier-ignore
            const tr2 = TabRegistry.fromMap(new Map([
                ['focuser3', focuser3],
                ['focuser4', focuser4],
            ]));
            // prettier-ignore
            const tr1 = TabRegistry.fromMap(new Map([
                ['focuser1', focuser1],
                ['focuser2', focuser2],
                ['registry2', tr2 as any],
            ]));

            const focusers = [...tr1];
            expect(focusers).toHaveLength(4);
        });

        test('...spreading empty registry results in empty array', () => {
            const tr = TabRegistry.empty();
            const focusers = [...tr];
            expect(focusers).toHaveLength(0);
        });

        test('retrieving an iterator including nested registries', () => {
            const focuser = getSuccessFocuser();
            // prettier-ignore
            const tr2 = TabRegistry.fromMap(new Map([
                ['focuser3', focuser],
                ['focuser4', focuser],
            ]));
            // prettier-ignore
            const tr1 = TabRegistry.fromMap(new Map([
                ['focuser1', focuser],
                ['focuser2', focuser],
                ['registry2', tr2 as any],
            ]));

            const iter = tr1[Symbol.iterator](true);

            expect(jest.isMockFunction(iter.next().value)).toBe(true);
            expect(jest.isMockFunction(iter.next().value)).toBe(true);
            expect(iter.next().value).toBeInstanceOf(TabRegistry);
            expect(jest.isMockFunction(iter.next().value)).toBe(true);
            expect(jest.isMockFunction(iter.next().value)).toBe(true);
            expect(iter.next().value).toBeUndefined();
        });
    });

    describe('.keysRecursive', () => {
        test('retrieving keys on empty registry, returns nothing', () => {
            const tr = TabRegistry.empty();
            const keys = [...tr.keysRecursive()];
            expect(keys).toHaveLength(0);
        });

        test('nested registries is flattened', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();
            const focuser4 = getSuccessFocuser();

            // prettier-ignore
            const tr2 = TabRegistry.fromMap(new Map([
                ['focuser3', focuser3],
                ['focuser4', focuser4],
            ]));
            // prettier-ignore
            const tr1 = TabRegistry.fromMap(new Map([
                ['focuser1', focuser1],
                ['focuser2', focuser2],
                ['registry2', tr2 as any],
            ]));

            expect([...tr1.keysRecursive()]).toHaveLength(5);
            expect([...tr1.keysRecursive(false)]).toHaveLength(4);
        });
    });

    describe('.rootRegistry', () => {
        test('return self, when no parent', () => {
            const tr = new TabRegistry<number>();
            expect(tr).toBe(tr.rootRegistry);
        });

        test('return parent if parent is root', () => {
            const parentTr = new TabRegistry<number>();
            const tr = new TabRegistry<number>();

            parentTr.add(0, tr);

            expect(tr.rootRegistry).toBe(parentTr);
        });

        test('return top level when more than one level of registries', () => {
            const tr = new TabRegistry<number>();
            const parentTr = new TabRegistry<number>();
            const rootTr = new TabRegistry<number>();

            rootTr.add(0, parentTr);
            parentTr.add(0, tr);

            expect(tr.rootRegistry).toBe(rootTr);
        });
    });

    describe('.lastKey', () => {
        test('retrieving last key on emptry registry returns null', () => {
            const tr = TabRegistry.empty();
            expect(tr.lastKey).toBe(null);
        });
    });

    describe('.last', () => {
        test('retrieving last focuser on emptry registry returns null', () => {
            const tr = TabRegistry.empty();
            expect(tr.last).toBe(null);
        });

        test('retrieving last focuser on non-empty registry', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([['focuser', focuser]]));
            expect(tr.last).toBe(focuser);
        });
    });

    describe('.firstKey', () => {
        test('retrieving first key on emptry registry returns null', () => {
            const tr = TabRegistry.empty();
            expect(tr.firstKey).toBe(null);
        });
    });

    describe('.first', () => {
        test('retrieving first focuser on emptry registry returns null', () => {
            const tr = TabRegistry.empty();
            expect(tr.first).toBe(null);
        });

        test('retrieving first focuser on non-empty registry', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([['focuser', focuser]]));
            expect(tr.first).toBe(focuser);
        });
    });

    describe('.isCycleEnabled', () => {
        test('property is false when disabled', () => {
            const tr = TabRegistry.empty({ cycle: false });
            expect(tr.isCycleEnabled).toBe(false);
        });
        test('property is true when enabled', () => {
            const tr = TabRegistry.empty({ cycle: true });
            expect(tr.isCycleEnabled).toBe(true);
        });
    });
});
