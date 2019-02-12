import { ModifierKeys, NavigationKeyHandler } from '../components/Focuser';
import { createNavigationHandler, NavigationMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';

function getFailureFocuser() {
    return jest.fn(() => false);
}
function getSuccessFocuser() {
    return jest.fn(() => true);
}

const noModifierKeys: ModifierKeys = {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
};

const shiftModiferKey: ModifierKeys = {
    ...noModifierKeys,
    shiftKey: true,
};

describe('FieldNavigation', () => {
    describe('simple arrow nav', () => {
        const createFocusersFromMap = (
            navMap: NavigationMap,
            tabDirectionAxis: 'x' | 'y' = 'x',
        ): [Map<string, () => void>, NavigationKeyHandler] => {
            const tabRegistry = new TabRegistry<string>();
            const registryFetcher = () => tabRegistry;
            const focuserMap = new Map<string, () => void>();
            let key: string | null = null;
            // tslint:disable-next-line:prefer-for-of
            for (let y = 0; y < navMap.length; y++) {
                // tslint:disable-next-line:prefer-for-of
                for (let x = 0; x < navMap[y].length; x++) {
                    key = navMap[y][x];
                    if (key != null) {
                        const focuser = key.startsWith('no-focus-') ? getFailureFocuser() : getSuccessFocuser();
                        focuserMap.set(key, focuser);
                        tabRegistry.add(key, focuser);
                    }
                }
            }

            // prettier-ignore
            return [
                focuserMap,
                createNavigationHandler(navMap, registryFetcher, tabDirectionAxis),
            ];
        };

        test('navigate right attempts to focus the field to the right', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', 'right'],
            ]);

            handler('left', 'ArrowRight', noModifierKeys);

            expect(focuserMap.get('left')).not.toHaveBeenCalled();
            expect(focuserMap.get('right')).toHaveBeenCalled();
        });

        test('navigate left attempts to focus the field to the left', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', 'right'],
            ]);

            handler('right', 'ArrowLeft', noModifierKeys);

            expect(focuserMap.get('left')).toHaveBeenCalled();
            expect(focuserMap.get('right')).not.toHaveBeenCalled();
        });

        test('navigate up attempts to focus the field on the top', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top'], ['bottom'],
            ]);

            handler('bottom', 'ArrowUp', noModifierKeys);

            expect(focuserMap.get('top')).toHaveBeenCalled();
            expect(focuserMap.get('bottom')).not.toHaveBeenCalled();
        });

        test('navigate down attempts to focus the field in the bottom', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top'], ['bottom'],
            ]);

            handler('top', 'ArrowDown', noModifierKeys);

            expect(focuserMap.get('top')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom')).toHaveBeenCalled();
        });

        test('navigate right attempts to focus the field to the right', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', 'right'],
            ]);

            handler('left', 'ArrowRight', noModifierKeys);

            expect(focuserMap.get('left')).not.toHaveBeenCalled();
            expect(focuserMap.get('right')).toHaveBeenCalled();
        });

        test('navigate left attempts to focus this field to the left', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', 'right'],
            ]);

            handler('right', 'ArrowLeft', noModifierKeys);

            expect(focuserMap.get('left')).toHaveBeenCalled();
            expect(focuserMap.get('right')).not.toHaveBeenCalled();
        });

        test('navigate right skips empty second column and focus third', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', null, 'right'],
            ]);

            handler('left', 'ArrowRight', noModifierKeys);

            expect(focuserMap.get('left')).not.toHaveBeenCalled();
            expect(focuserMap.get('right')).toHaveBeenCalled();
        });

        test('navigate up skips empty second row and focus first', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top'],
                [null],
                ['bottom'],
            ]);

            handler('bottom', 'ArrowUp', noModifierKeys);

            expect(focuserMap.get('top')).toHaveBeenCalled();
            expect(focuserMap.get('bottom')).not.toHaveBeenCalled();
        });

        test('navigate down skips empty second row and focus third', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top'],
                [null],
                ['bottom'],
            ]);

            handler('top', 'ArrowDown', noModifierKeys);

            expect(focuserMap.get('top')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom')).toHaveBeenCalled();
        });

        test('navigate left skips empty second column and focus first', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', null, 'right'],
            ]);

            handler('right', 'ArrowLeft', noModifierKeys);

            expect(focuserMap.get('left')).toHaveBeenCalled();
            expect(focuserMap.get('right')).not.toHaveBeenCalled();
        });

        test('navigate left from left most column calls no focuser', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ]);

            handler('bottom-left', 'ArrowLeft', noModifierKeys);

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();

            handler('top-left', 'ArrowLeft', noModifierKeys);

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();
        });

        test('navigate right from right most column calls no focuser', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ]);

            handler('bottom-right', 'ArrowRight', noModifierKeys);

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();

            handler('top-right', 'ArrowRight', noModifierKeys);

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();
        });

        test('navigate up from top most row calls no focuser', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ]);

            handler('top-left', 'ArrowUp', noModifierKeys);

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();

            handler('top-right', 'ArrowUp', noModifierKeys);

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();
        });

        test('navigate down from bottom most row calls no focuser', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ]);

            handler('bottom-left', 'ArrowDown', noModifierKeys);

            focuserMap.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(4);

            handler('bottom-right', 'ArrowDown', noModifierKeys);

            focuserMap.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(8);
        });

        test('navigate right, skips no-focusers column and attempts focusing same row in third column', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', null, 'top-right'],
                ['middle-left', null, 'middle-right'],
                ['bottom-left', null, 'bottom-right'],
            ]);

            handler('middle-left', 'ArrowRight', noModifierKeys);

            focuserMap.forEach((focuser, key) =>
                key === 'middle-right' ? expect(focuser).toHaveBeenCalled() : expect(focuser).not.toHaveBeenCalled(),
            );

            expect.assertions(6);
        });

        test('navigate left, skips no-focusers column and attempts focusing same row in first column', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', null, 'top-right'],
                ['middle-left', null, 'middle-right'],
                ['bottom-left', null, 'bottom-right'],
            ]);

            handler('middle-right', 'ArrowLeft', noModifierKeys);

            focuserMap.forEach((focuser, key) =>
                key === 'middle-left' ? expect(focuser).toHaveBeenCalled() : expect(focuser).not.toHaveBeenCalled(),
            );

            expect.assertions(6);
        });

        test('navigate up, when no focusable columns left, then no focusers are called', () => {
            // prettier-ignore
            const [focuserMap1, handler1] = createFocusersFromMap([
                [null, 'top-right'],
                [null, 'middle-right'],
                ['bottom-left', 'bottom-right'],
            ]);
            handler1('bottom-left', 'ArrowUp', noModifierKeys);
            focuserMap1.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(4);

            // prettier-ignore
            const [focuserMap2, handler2] = createFocusersFromMap([
                ['top-left', null],
                ['middle-left', null],
                ['bottom-left', 'bottom-right'],
            ]);
            handler2('bottom-right', 'ArrowUp', noModifierKeys);
            focuserMap2.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(8);
        });

        test('navigate left, focus up when immediate left is not focusable', () => {
            // prettier-ignore
            const [focuserMap1, handler1] = createFocusersFromMap([
                ['top-left', 'top-right'],
                [null, 'middle-right'],
                ['bottom-left', 'bottom-right'],
            ]);
            handler1('middle-right', 'ArrowLeft', noModifierKeys);
            focuserMap1.forEach((focuser, key) =>
                key === 'top-left' ? expect(focuser).toHaveBeenCalled() : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(5);

            // prettier-ignore
            const [focuserMap2, handler2] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['no-focus-middle-left', 'middle-right'],
                ['bottom-left', 'bottom-right'],
            ]);
            handler2('middle-right', 'ArrowLeft', noModifierKeys);
            focuserMap2.forEach((focuser, key) =>
                key === 'top-left' || key === 'no-focus-middle-left'
                    ? expect(focuser).toHaveBeenCalled()
                    : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(11);
        });

        test('navigate right, focus up when immediate right is not focusable', () => {
            // prettier-ignore
            const [focuserMap1, handler1] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['middle-left', null],
                ['bottom-left', 'bottom-right'],
            ]);
            handler1('middle-left', 'ArrowRight', noModifierKeys);
            focuserMap1.forEach((focuser, key) =>
                key === 'top-right' ? expect(focuser).toHaveBeenCalled() : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(5);

            // prettier-ignore
            const [focuserMap2, handler2] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['middle-left', 'no-focus-middle-right'],
                ['bottom-left', 'bottom-right'],
            ]);
            handler2('middle-left', 'ArrowRight', noModifierKeys);
            focuserMap2.forEach((focuser, key) =>
                key === 'top-right' || key === 'no-focus-middle-right'
                    ? expect(focuser).toHaveBeenCalled()
                    : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(11);
        });

        test('navigate with tab use x-axis as direction focus to the right', () => {
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ]);
            handler('top-left', 'Tab', noModifierKeys);
            focuserMap.forEach((focuser, key) =>
                key === 'top-right'
                    ? expect(focuser).toHaveBeenCalledWith({ focusOrigin: 'prev' })
                    : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(4);
        });

        test('navigate with shift-tab use x-axis as direction focus to the left', () => {
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ]);
            handler('top-right', 'Tab', shiftModiferKey);
            focuserMap.forEach((focuser, key) =>
                key === 'top-left'
                    ? expect(focuser).toHaveBeenCalledWith({ focusOrigin: 'next' })
                    : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(4);
        });

        test('navigate with tab use y-axis as direction focus to the right', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ], 'y');

            handler('top-left', 'Tab', noModifierKeys);
            focuserMap.forEach((focuser, key) =>
                key === 'bottom-left'
                    ? expect(focuser).toHaveBeenCalledWith({ focusOrigin: 'prev' })
                    : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(4);
        });

        test('navigate with shift-tab use y-axis as direction focus up', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ], 'y');
            handler('bottom-right', 'Tab', shiftModiferKey);
            focuserMap.forEach((focuser, key) =>
                key === 'top-right'
                    ? expect(focuser).toHaveBeenCalledWith({ focusOrigin: 'next' })
                    : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(4);
        });

        test('navigation handler on non-existing key does not throw', () => {
            const handler = createNavigationHandler([['field1', 'field2']], () => null);

            expect(() =>
                handler('non-exist1', 'ArrowRight', { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }),
            ).not.toThrow();
        });

        test('navigation handler does not act when modifier keys are pressed', () => {
            const [focuserMap, handler] = createFocusersFromMap([['field1', 'field2']]);

            handler('field1', 'ArrowRight', { altKey: true, ctrlKey: false, metaKey: false, shiftKey: false });
            focuserMap.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(2);

            handler('field1', 'ArrowRight', { altKey: false, ctrlKey: true, metaKey: false, shiftKey: false });
            focuserMap.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(4);

            handler('field1', 'ArrowRight', { altKey: false, ctrlKey: false, metaKey: true, shiftKey: false });
            focuserMap.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(6);

            handler('field1', 'ArrowRight', { altKey: false, ctrlKey: false, metaKey: false, shiftKey: true });
            focuserMap.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(8);
        });

        test('navigation handler does not throw on unknown key pressed', () => {
            const handler = createNavigationHandler([['field1', 'field2']], () => null);
            expect(() => handler('field1', 'QuestionMark', noModifierKeys)).not.toThrow();
        });
    });
});
