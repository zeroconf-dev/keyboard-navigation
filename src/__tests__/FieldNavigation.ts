import { createNavigationHandler, FieldMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';

function getSuccessFocuser() {
    return jest.fn(() => true);
}

describe('FieldNavigation', () => {
    describe('simple arrow nav', () => {
        let tabRegistry: TabRegistry<string>;
        let fieldMap: FieldMap<string>;

        beforeEach(() => {
            tabRegistry = new TabRegistry<string>();
        });

        test('navigate right attempts to focus the field to the right', () => {
            const focuserLeft = getSuccessFocuser();
            const focuserRight = getSuccessFocuser();

            tabRegistry.add('left', focuserLeft);
            tabRegistry.add('right', focuserRight);

            fieldMap = [['left', 'right']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);

            handler('left', 'ArrowRight');

            expect(focuserLeft).not.toHaveBeenCalled();
            expect(focuserRight).toHaveBeenCalled();
        });

        test('navigate left attempts to focus the field to the left', () => {
            const focuserLeft = getSuccessFocuser();
            const focuserRight = getSuccessFocuser();

            tabRegistry.add('left', focuserLeft);
            tabRegistry.add('right', focuserRight);

            fieldMap = [['left', 'right']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);

            handler('right', 'ArrowLeft');

            expect(focuserLeft).toHaveBeenCalled();
            expect(focuserRight).not.toHaveBeenCalled();
        });

        test('navigate up attempts to focus the field on the top', () => {
            const focuserTop = getSuccessFocuser();
            const focuserBottom = getSuccessFocuser();

            tabRegistry.add('top', focuserTop);
            tabRegistry.add('bottom', focuserBottom);

            fieldMap = [['top'], ['bottom']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);

            handler('bottom', 'ArrowUp');

            expect(focuserTop).toHaveBeenCalled();
            expect(focuserBottom).not.toHaveBeenCalled();
        });

        test('navigate down attempts to focus the field in the bottom', () => {
            const focuserTop = getSuccessFocuser();
            const focuserBottom = getSuccessFocuser();

            tabRegistry.add('top', focuserTop);
            tabRegistry.add('bottom', focuserBottom);

            fieldMap = [['top'], ['bottom']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);

            handler('top', 'ArrowDown');

            expect(focuserTop).not.toHaveBeenCalled();
            expect(focuserBottom).toHaveBeenCalled();
        });

        test('navigate right attempts to focus the field to the right', () => {
            const focuserLeft = getSuccessFocuser();
            const focuserRight = getSuccessFocuser();

            tabRegistry.add('left', focuserLeft);
            tabRegistry.add('right', focuserRight);

            fieldMap = [['left', 'right']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);

            handler('left', 'ArrowRight');

            expect(focuserLeft).not.toHaveBeenCalled();
            expect(focuserRight).toHaveBeenCalled();
        });

        test('navigate left attempts to focus this field to the left', () => {
            const focuserLeft = getSuccessFocuser();
            const focuserRight = getSuccessFocuser();

            tabRegistry.add('left', focuserLeft);
            tabRegistry.add('right', focuserRight);

            fieldMap = [['left', 'right']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);
            handler('right', 'ArrowLeft');

            expect(focuserLeft).toHaveBeenCalled();
            expect(focuserRight).not.toHaveBeenCalled();
        });

        test('navigate right skips empty second column and focus third', () => {
            const focuserLeft = getSuccessFocuser();
            const focuserRight = getSuccessFocuser();

            tabRegistry.add('left', focuserLeft);
            tabRegistry.add('right', focuserRight);

            fieldMap = [['left', null, 'right']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);

            handler('left', 'ArrowRight');

            expect(focuserLeft).not.toHaveBeenCalled();
            expect(focuserRight).toHaveBeenCalled();
        });

        test('navigate up skips empty second row and focus first', () => {
            const focuserTop = getSuccessFocuser();
            const focuserBottom = getSuccessFocuser();

            tabRegistry.add('top', focuserTop);
            tabRegistry.add('bottom', focuserBottom);

            fieldMap = [['top'], [null], ['bottom']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);
            handler('bottom', 'ArrowUp');

            expect(focuserTop).toHaveBeenCalled();
            expect(focuserBottom).not.toHaveBeenCalled();
        });

        test('navigate down skips empty second row and focus third', () => {
            const focuserTop = getSuccessFocuser();
            const focuserBottom = getSuccessFocuser();

            tabRegistry.add('top', focuserTop);
            tabRegistry.add('bottom', focuserBottom);

            fieldMap = [['top'], [null], ['bottom']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);
            handler('top', 'ArrowDown');

            expect(focuserTop).not.toHaveBeenCalled();
            expect(focuserBottom).toHaveBeenCalled();
        });

        test('navigate left skips empty second column and focus first', () => {
            const focuserLeft = getSuccessFocuser();
            const focuserRight = getSuccessFocuser();

            tabRegistry.add('left', focuserLeft);
            tabRegistry.add('right', focuserRight);

            fieldMap = [['left', null, 'right']];

            const handler = createNavigationHandler(fieldMap, () => tabRegistry);
            handler('right', 'ArrowLeft');

            expect(focuserLeft).toHaveBeenCalled();
            expect(focuserRight).not.toHaveBeenCalled();
        });
    });
});
