import { ArrowKey } from '../components/Focuser';
import { createNavigationHandler, FieldMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';

function getFailureFocuser() {
    return jest.fn(() => false);
}
function getSuccessFocuser() {
    return jest.fn(() => true);
}

describe('FieldNavigation', () => {
    describe('simple arrow nav', () => {
        const createFocusersFromMap = (
            navMap: FieldMap<string>,
        ): [Map<string, () => void>, (label: string, arrowKey: ArrowKey) => void] => {
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
                createNavigationHandler(navMap, registryFetcher),
            ];
        };

        test('navigate right attempts to focus the field to the right', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', 'right'],
            ]);

            handler('left', 'ArrowRight');

            expect(focuserMap.get('left')).not.toHaveBeenCalled();
            expect(focuserMap.get('right')).toHaveBeenCalled();
        });

        test('navigate left attempts to focus the field to the left', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', 'right'],
            ]);

            handler('right', 'ArrowLeft');

            expect(focuserMap.get('left')).toHaveBeenCalled();
            expect(focuserMap.get('right')).not.toHaveBeenCalled();
        });

        test('navigate up attempts to focus the field on the top', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top'], ['bottom'],
            ]);

            handler('bottom', 'ArrowUp');

            expect(focuserMap.get('top')).toHaveBeenCalled();
            expect(focuserMap.get('bottom')).not.toHaveBeenCalled();
        });

        test('navigate down attempts to focus the field in the bottom', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top'], ['bottom'],
            ]);

            handler('top', 'ArrowDown');

            expect(focuserMap.get('top')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom')).toHaveBeenCalled();
        });

        test('navigate right attempts to focus the field to the right', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', 'right'],
            ]);

            handler('left', 'ArrowRight');

            expect(focuserMap.get('left')).not.toHaveBeenCalled();
            expect(focuserMap.get('right')).toHaveBeenCalled();
        });

        test('navigate left attempts to focus this field to the left', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', 'right'],
            ]);

            handler('right', 'ArrowLeft');

            expect(focuserMap.get('left')).toHaveBeenCalled();
            expect(focuserMap.get('right')).not.toHaveBeenCalled();
        });

        test('navigate right skips empty second column and focus third', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', null, 'right'],
            ]);

            handler('left', 'ArrowRight');

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

            handler('bottom', 'ArrowUp');

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

            handler('top', 'ArrowDown');

            expect(focuserMap.get('top')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom')).toHaveBeenCalled();
        });

        test('navigate left skips empty second column and focus first', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['left', null, 'right'],
            ]);

            handler('right', 'ArrowLeft');

            expect(focuserMap.get('left')).toHaveBeenCalled();
            expect(focuserMap.get('right')).not.toHaveBeenCalled();
        });

        test('navigate left from left most column calls no focuser', () => {
            // prettier-ignore
            const [focuserMap, handler] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['bottom-left', 'bottom-right'],
            ]);

            handler('bottom-left', 'ArrowLeft');

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();

            handler('top-left', 'ArrowLeft');

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

            handler('bottom-right', 'ArrowRight');

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();

            handler('top-right', 'ArrowRight');

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

            handler('top-left', 'ArrowUp');

            expect(focuserMap.get('top-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-left')).not.toHaveBeenCalled();
            expect(focuserMap.get('top-right')).not.toHaveBeenCalled();
            expect(focuserMap.get('bottom-right')).not.toHaveBeenCalled();

            handler('top-right', 'ArrowUp');

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

            handler('bottom-left', 'ArrowDown');

            focuserMap.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(4);

            handler('bottom-right', 'ArrowDown');

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

            handler('middle-left', 'ArrowRight');

            focuserMap.forEach(
                (focuser, key) =>
                    key === 'middle-right'
                        ? expect(focuser).toHaveBeenCalled()
                        : expect(focuser).not.toHaveBeenCalled(),
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

            handler('middle-right', 'ArrowLeft');

            focuserMap.forEach(
                (focuser, key) =>
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
            handler1('bottom-left', 'ArrowUp');
            focuserMap1.forEach(focuser => expect(focuser).not.toHaveBeenCalled());
            expect.assertions(4);

            // prettier-ignore
            const [focuserMap2, handler2] = createFocusersFromMap([
                ['top-left', null],
                ['middle-left', null],
                ['bottom-left', 'bottom-right'],
            ]);
            handler2('bottom-right', 'ArrowUp');
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
            handler1('middle-right', 'ArrowLeft');
            focuserMap1.forEach(
                (focuser, key) =>
                    key === 'top-left' ? expect(focuser).toHaveBeenCalled() : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(5);

            // prettier-ignore
            const [focuserMap2, handler2] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['no-focus-middle-left', 'middle-right'],
                ['bottom-left', 'bottom-right'],
            ]);
            handler2('middle-right', 'ArrowLeft');
            focuserMap2.forEach(
                (focuser, key) =>
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
            handler1('middle-left', 'ArrowRight');
            focuserMap1.forEach(
                (focuser, key) =>
                    key === 'top-right' ? expect(focuser).toHaveBeenCalled() : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(5);

            // prettier-ignore
            const [focuserMap2, handler2] = createFocusersFromMap([
                ['top-left', 'top-right'],
                ['middle-left', 'no-focus-middle-right'],
                ['bottom-left', 'bottom-right'],
            ]);
            handler2('middle-left', 'ArrowRight');
            focuserMap2.forEach(
                (focuser, key) =>
                    key === 'top-right' || key === 'no-focus-middle-right'
                        ? expect(focuser).toHaveBeenCalled()
                        : expect(focuser).not.toHaveBeenCalled(),
            );
            expect.assertions(11);
        });
    });
});
