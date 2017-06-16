import { FocuserFn, TabRegistry } from '../TabRegistry';

const getSuccessFocuser = () => jest.fn().mockReturnValue(true);
const getNotFocuser = () => jest.fn().mockReturnValue(false);

describe('TabRegistry', () => {
    describe('TabRegistry.fromMap', () => {
        test('constructing linear structure', () => {
            const focuser: FocuserFn = jest.fn();
            const tr = TabRegistry.fromMap(new Map<number, FocuserFn>([[1, focuser], [2, focuser], [3, focuser]]));
            expect(Array.from(tr.keysRecursive())).toEqual([1, 2, 3]);
        });

        test('constructing complex structure', () => {
            const focuser: FocuserFn = jest.fn();
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
                31,
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
    });

    describe('.delete()', () => {
        test("deleting a key that doesn't exist throws", () => {
            const tr = new TabRegistry<number>();
            expect(() => tr.delete(1)).toThrowErrorMatchingSnapshot();
        });

        test('deleting a key removes it from the registry', () => {
            const focuser = jest.fn();
            const tr = TabRegistry.fromMap(new Map([[1, focuser], [2, focuser]]));
            expect(tr.has(1)).toBe(true);
            tr.delete(1);
            expect(tr.has(1)).toBe(false);
        });

        test('deleting the first key, will assign the next in line as first', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser3 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser1], [2, focuser2], [3, focuser3]]));

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
            const tr = TabRegistry.fromMap(new Map([[1, focuser1], [2, focuser2], [3, focuser3]]));

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

            const cycleRegistry = TabRegistry.fromMap(new Map([[1, cycleFocuser1], [2, cycleFocuser2]]), {
                cycle: true,
            });
            const nonCycleRegistry = TabRegistry.fromMap(new Map([[1, nonCycleFocuser1], [2, nonCycleFocuser2]]), {
                cycle: true,
            }).disableCycle();

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

            const cycleRegistry = TabRegistry.fromMap(new Map([[1, cycleFocuser1], [2, cycleFocuser2]])).enableCycle();
            const nonCycleRegistry = TabRegistry.fromMap(new Map([[1, nonCycleFocuser1], [2, nonCycleFocuser2]]));

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
            const tr = TabRegistry.fromMap(new Map([['focus', successFocuser], ['not-focus', notFocuser]]));

            expect(tr.focus('focus')).toBe(true);
            expect(tr.focus('not-focus')).toBe(false);
        });

        test('empty focus call on empty registry returns false', () => {
            const tr = TabRegistry.empty();
            expect(tr.focus()).toBe(false);
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
            const tr = TabRegistry.fromMap(new Map([['focus', successFocuser], ['not-focus', notFocuser]]));

            expect(tr.focusFirst()).toBe(true);
            expect(successFocuser).toHaveBeenCalledTimes(1);
            tr.delete('focus');
            expect(tr.focusFirst()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(1);
        });

        test('focusing a key that returns false, executes next focuser, stop on success and return true', () => {
            const successFocuser = getSuccessFocuser();
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, notFocuser], [2, successFocuser]]));
            expect(tr.focusFirst()).toBe(true);
            expect(notFocuser).toHaveBeenCalledTimes(1);
            expect(successFocuser).toHaveBeenCalledTimes(1);
        });

        test('a set with only *not* focuser, will run through the whole set and return false', () => {
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([[1, notFocuser], [2, notFocuser], [3, notFocuser], [4, notFocuser]]),
            );

            expect(tr.focusFirst()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(4);
        });

        test('a set with only *not* focuser will return even if cycle is enabled', () => {
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([[1, notFocuser], [2, notFocuser], [3, notFocuser], [4, notFocuser]]),
            ).enableCycle();

            expect(tr.focusFirst()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(4);
        });
    });

    describe('.focusFirstIn()', () => {
        test("focus nested registry that doesn't exist will return false", () => {
            const tr = new TabRegistry();
            expect(tr.focusIn([2])).toBe(false);
        });

        test('focus an existing first level non-success focuer will return false', () => {
            const focuser = getNotFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusIn([1])).toBe(false);
        });

        test('focus a tab registry as leaf will focus the first focuser in the registry', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser1], [2, focuser2]]));
            const parentTr = TabRegistry.fromMap(new Map([[1, tr]]));
            expect(focuser1).not.toHaveBeenCalled();
            expect(parentTr.focusIn([1])).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).not.toHaveBeenCalled();
        });

        test('focus a deeply nested registry', () => {
            const focuser = getSuccessFocuser();
            const tr5 = TabRegistry.fromMap(new Map([[1, focuser]]));
            const tr4 = TabRegistry.fromMap(new Map<number, FocuserFn | TabRegistry>([[1, focuser], [2, tr5]]));
            const tr3 = TabRegistry.fromMap(new Map<number, FocuserFn | TabRegistry>([[1, focuser], [2, tr4]]));
            const tr2 = TabRegistry.fromMap(new Map<number, FocuserFn | TabRegistry>([[1, focuser], [2, tr3]]));
            const tr1 = TabRegistry.fromMap(new Map<number, FocuserFn | TabRegistry>([[1, focuser], [2, tr2]]));

            expect(tr1.focusIn([2, 2, 2, 2, 1])).toBe(true);
            expect(focuser).toHaveBeenCalledTimes(1);
        });
    });

    describe('.focusIn()', () => {
        test("focus nested registry that doesn't exist will return false", () => {
            const tr = new TabRegistry();
            expect(tr.focusIn([1, 2])).toBe(false);
        });

        test('focus an existing first level success focuser will return true', () => {
            const focuser = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusIn([1])).toBe(true);
        });

        test('focus an existing first level non-success focuer will return false', () => {
            const focuser = getNotFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser]]));
            expect(tr.focusIn([1])).toBe(false);
        });

        test('focus a tab registry as leaf will focus the first focuser in the registry', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, focuser1], [2, focuser2]]));
            const parentTr = TabRegistry.fromMap(new Map([[1, tr]]));
            expect(focuser1).not.toHaveBeenCalled();
            expect(parentTr.focusIn([1])).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(focuser2).not.toHaveBeenCalled();
        });

        test('focus a deeply nested registry', () => {
            const focuser = getSuccessFocuser();
            const tr5 = TabRegistry.fromMap(new Map([[1, focuser]]));
            const tr4 = TabRegistry.fromMap(new Map<number, FocuserFn | TabRegistry>([[1, focuser], [2, tr5]]));
            const tr3 = TabRegistry.fromMap(new Map<number, FocuserFn | TabRegistry>([[1, focuser], [2, tr4]]));
            const tr2 = TabRegistry.fromMap(new Map<number, FocuserFn | TabRegistry>([[1, focuser], [2, tr3]]));
            const tr1 = TabRegistry.fromMap(new Map<number, FocuserFn | TabRegistry>([[1, focuser], [2, tr2]]));

            expect(tr1.focusIn([2, 2, 2, 2, 1])).toBe(true);
            expect(focuser).toHaveBeenCalledTimes(1);
        });
    });

    describe('.focusNext()', () => {
        return;
    });

    describe('.focusNextIn()', () => {
        return;
    });

    describe('.focusLast()', () => {
        test('focus first on an empty registry returns false', () => {
            const tr = new TabRegistry();
            expect(tr.focusLast()).toBe(false);
        });

        test('focusing a key that exists returns what the focuser returns', () => {
            const successFocuser = getSuccessFocuser();
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(new Map([['not-focus', notFocuser], ['focus', successFocuser]]));

            expect(tr.focusLast()).toBe(true);
            expect(successFocuser).toHaveBeenCalledTimes(1);
            tr.delete('focus');
            expect(tr.focusLast()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(1);
        });

        test('focusing a key that returns false, executes next focuser, stop on success and return true', () => {
            const successFocuser = getSuccessFocuser();
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(new Map([[1, successFocuser], [2, notFocuser]]));
            expect(tr.focusLast()).toBe(true);
            expect(notFocuser).toHaveBeenCalledTimes(1);
            expect(successFocuser).toHaveBeenCalledTimes(1);
        });

        test('a set with only *not* focuser, will run through the whole set and return false', () => {
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([[1, notFocuser], [2, notFocuser], [3, notFocuser], [4, notFocuser]]),
            );

            expect(tr.focusLast()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(4);
        });

        test('a set with only *not* focuser will return even if cycle is enabled', () => {
            const notFocuser = getNotFocuser();
            const tr = TabRegistry.fromMap(
                new Map([[1, notFocuser], [2, notFocuser], [3, notFocuser], [4, notFocuser]]),
            ).enableCycle();

            expect(tr.focusLast()).toBe(false);
            expect(notFocuser).toHaveBeenCalledTimes(4);
        });
    });

    describe('.focusLastIn()', () => {
        return;
    });

    describe('.focusPrev()', () => {
        return;
    });

    describe('.focusPrevIn()', () => {
        return;
    });

    describe('.get()', () => {
        return;
    });

    describe('.getNext()', () => {
        return;
    });

    describe('.getPrev()', () => {
        return;
    });

    describe('.has()', () => {
        return;
    });

    describe('.hasIn()', () => {
        return;
    });

    describe('.hasNext()', () => {
        return;
    });

    describe('.hasPrev()', () => {
        return;
    });

    describe('.keys()', () => {
        return;
    });

    describe('.keysRecursive()', () => {
        return;
    });

    describe('.moveNext()', () => {
        test('moving the last key has no effect', () => {
            const focuser = jest.fn();
            const tr = TabRegistry.fromMap(new Map([[1, focuser], [2, focuser], [3, focuser]]));
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
            tr.moveNext(3);
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
        });

        test("moving a key that doesn't exist throws", () => {
            const tr = new TabRegistry();
            expect(() => tr.moveNext(1)).toThrowErrorMatchingSnapshot();
        });

        test('moving a key actually moves the key in the registry', () => {
            const focuser = jest.fn();
            const tr = TabRegistry.fromMap(new Map([[1, focuser], [3, focuser], [2, focuser]]));
            expect(Array.from(tr.keys())).toEqual([1, 3, 2]);
            tr.moveNext(3);
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
        });
    });

    describe('.movePrev()', () => {
        test('moving the first key has no effect', () => {
            const focuser = jest.fn();
            const tr = TabRegistry.fromMap(new Map([[1, focuser], [2, focuser], [3, focuser]]));
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
            tr.movePrev(1);
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
        });

        test("moving a key that doesn't exist throws", () => {
            const tr = new TabRegistry();
            expect(() => tr.movePrev(1)).toThrowErrorMatchingSnapshot();
        });

        test('moving a key actually moves the key in the registry', () => {
            const focuser = jest.fn();
            const tr = TabRegistry.fromMap(new Map([[2, focuser], [1, focuser], [3, focuser]]));
            expect(Array.from(tr.keys())).toEqual([2, 1, 3]);
            tr.movePrev(1);
            expect(Array.from(tr.keys())).toEqual([1, 2, 3]);
        });
    });

    describe('.set()', () => {
        return;
    });

    describe('.toString()', () => {
        test('complex registries get outputter correctly', () => {
            const focuser: FocuserFn = jest.fn();
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

    describe('Nested registries', () => {
        test('iterating through', () => {
            const focuser1 = getSuccessFocuser();
            const focuser2 = getSuccessFocuser();
            const focuser4 = getSuccessFocuser();

            const focuser5 = getSuccessFocuser();
            const focuser6 = getSuccessFocuser();
            const focuser7 = getSuccessFocuser();

            const parentTr = new TabRegistry<number>();
            const tr = new TabRegistry<number>();

            parentTr.add(1, focuser1);
            parentTr.add(2, focuser2);
            parentTr.add(3, tr);
            parentTr.add(4, focuser4);
            tr.add(5, focuser5);
            tr.add(6, focuser6);
            tr.add(7, focuser7);

            expect(parentTr.focusFirst()).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(1);
            expect(parentTr.focusNext(1)).toBe(true);
            expect(focuser2).toHaveBeenCalledTimes(1);
            expect(parentTr.focusNext(2)).toBe(true);
            expect(focuser5).toHaveBeenCalledTimes(1);
            expect(tr.focusNext(5)).toBe(true);
            expect(focuser6).toHaveBeenCalledTimes(1);
            expect(tr.focusNext(6)).toBe(true);
            expect(focuser7).toHaveBeenCalledTimes(1);
            expect(tr.focusNext(7)).toBe(true);
            expect(focuser4).toHaveBeenCalledTimes(1);
            expect(parentTr.focusNext(4)).toBe(false);

            expect(parentTr.focusLast()).toBe(true);
            expect(focuser4).toHaveBeenCalledTimes(2);
            expect(parentTr.focusPrev(4)).toBe(true);
            expect(focuser7).toHaveBeenCalledTimes(2);
            expect(tr.focusPrev(7)).toBe(true);
            expect(focuser6).toHaveBeenCalledTimes(2);
            expect(tr.focusPrev(6)).toBe(true);
            expect(focuser5).toHaveBeenCalledTimes(2);
            expect(tr.focusPrev(5)).toBe(true);
            expect(focuser2).toHaveBeenCalledTimes(2);
            expect(parentTr.focusPrev(2)).toBe(true);
            expect(focuser1).toHaveBeenCalledTimes(2);
            expect(parentTr.focusPrev(1)).toBe(false);

            expect(Array.from(parentTr.keysRecursive())).toEqual([1, 2, 5, 6, 7, 4]);
        });
    });
});
