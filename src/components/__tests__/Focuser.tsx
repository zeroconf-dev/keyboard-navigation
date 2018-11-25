import * as React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { assertNever } from '../../util';
import { Focuser, ModifierKeys } from '../Focuser';
import { TabBoundary } from '../TabBoundary';
import { allNavigationEvents, shiftTab, tab } from './__helpers__/event';

const noModifiers: ModifierKeys = {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
};

const shiftModifier: ModifierKeys = Object.assign({}, noModifiers, {
    shiftKey: true,
});

describe('Focuser', () => {
    afterEach(cleanup);

    test('focuser rendered outside boundary does not act on tab navigation', () => {
        const { getByValue } = render(<Focuser focusKey="test" />);
        const inputElement = getByValue('');
        const result = tab(inputElement);
        expect(result).toBe(true);
    });

    test('tab focuses the next field', () => {
        const onFocus = jest.fn();
        const { container } = render(
            <TabBoundary>
                <Focuser focusKey="focuser1" />
                <Focuser focusKey="focuser2" onFocus={onFocus} />
            </TabBoundary>,
        );

        const focuser1 = container.querySelector('[name=focuser1]') as HTMLInputElement;

        tab(focuser1);

        expect(onFocus).toHaveBeenCalled();
    });

    test('shift tab focuses the previous field', () => {
        const onFocus = jest.fn();
        const { container } = render(
            <TabBoundary>
                <Focuser focusKey="focuser1" onFocus={onFocus} />
                <Focuser focusKey="focuser2" />
            </TabBoundary>,
        );

        const focuser2 = container.querySelector('[name=focuser2]') as HTMLInputElement;

        shiftTab(focuser2);

        expect(onFocus).toHaveBeenCalled();
    });

    test('tab beyond last boundary do not focus anything', () => {
        const onFocus1 = jest.fn();
        const onFocus2 = jest.fn();
        const { container } = render(
            <TabBoundary>
                <Focuser focusKey="focuser1" onFocus={onFocus1} />
                <Focuser focusKey="focuser2" onFocus={onFocus2} />
            </TabBoundary>,
        );

        const focuser2 = container.querySelector('[name=focuser2]') as HTMLInputElement;

        tab(focuser2);

        expect(onFocus1).not.toHaveBeenCalled();
        expect(onFocus2).not.toHaveBeenCalled();
    });

    test('shift tab beyond last boundary do not focus anything', () => {
        const onFocus1 = jest.fn();
        const onFocus2 = jest.fn();
        const { container } = render(
            <TabBoundary>
                <Focuser focusKey="focuser1" onFocus={onFocus1} />
                <Focuser focusKey="focuser2" onFocus={onFocus2} />
            </TabBoundary>,
        );

        const focuser1 = container.querySelector('[name=focuser1]') as HTMLInputElement;

        shiftTab(focuser1);

        expect(onFocus1).not.toHaveBeenCalled();
        expect(onFocus2).not.toHaveBeenCalled();
    });

    test('disabled field cannot get focused', () => {
        const onFocus = jest.fn();
        const { container } = render(
            <TabBoundary>
                <Focuser focusKey="focuser1" />
                <Focuser disabled={true} focusKey="focuser2" onFocus={onFocus} />
            </TabBoundary>,
        );

        const focuser1 = container.querySelector('[name=focuser1]') as HTMLInputElement;

        tab(focuser1);

        expect(onFocus).not.toHaveBeenCalled();
    });

    test('onArrowKeys is called on arrow keyboard evens', () => {
        const onArrowKeys = jest.fn();
        const { container } = render(<Focuser focusKey="focuser1" onArrowKeys={onArrowKeys} />);

        const focuser = container.querySelector('[name=focuser1]') as HTMLInputElement;

        allNavigationEvents.forEach(event => fireEvent.keyDown(focuser, event));

        expect(onArrowKeys).toHaveBeenCalledWith('focuser1', 'ArrowUp', noModifiers);
        expect(onArrowKeys).toHaveBeenCalledWith('focuser1', 'ArrowDown', noModifiers);
        expect(onArrowKeys).toHaveBeenCalledWith('focuser1', 'ArrowLeft', noModifiers);
        expect(onArrowKeys).toHaveBeenCalledWith('focuser1', 'ArrowRight', noModifiers);
        expect(onArrowKeys).toHaveBeenCalledTimes(4);
    });

    test('onNavKeys is called on all navigation keys', () => {
        const onNavigationKeys = jest.fn();
        const { container } = render(<Focuser focusKey="focuser1" onNavigationKeys={onNavigationKeys} />);

        const focuser = container.querySelector('[name=focuser1]') as HTMLInputElement;

        allNavigationEvents.forEach(event => fireEvent.keyDown(focuser, event));

        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'ArrowDown', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'ArrowLeft', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'ArrowRight', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'ArrowUp', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'Delete', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'Enter', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'Escape', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'Minus', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'Plus', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'Space', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'Tab', noModifiers);
        expect(onNavigationKeys).toHaveBeenCalledWith('focuser1', 'Tab', shiftModifier);
        expect(onNavigationKeys).toHaveBeenCalledTimes(12);
    });

    test('all single event handlers are called', () => {
        const onArrowDown = jest.fn();
        const onArrowLeft = jest.fn();
        const onArrowRight = jest.fn();
        const onArrowUp = jest.fn();
        const onDelete = jest.fn();
        const onEnter = jest.fn();
        const onEscape = jest.fn();
        const onMinus = jest.fn();
        const onPlus = jest.fn();
        const onSpace = jest.fn();

        const { container } = render(
            <Focuser
                focusKey="focuser"
                onArrowDown={onArrowDown}
                onArrowLeft={onArrowLeft}
                onArrowRight={onArrowRight}
                onArrowUp={onArrowUp}
                onDelete={onDelete}
                onEnter={onEnter}
                onEscape={onEscape}
                onMinus={onMinus}
                onPlus={onPlus}
                onSpace={onSpace}
            />,
        );

        const focuser = container.querySelector('[name=focuser]') as HTMLInputElement;

        allNavigationEvents.forEach(event => {
            fireEvent.keyDown(focuser, event);
            switch (event.key) {
                case ' ':
                    return expect(onSpace).toHaveBeenCalled();
                case '+':
                    return expect(onPlus).toHaveBeenCalled();
                case '-':
                    return expect(onMinus).toHaveBeenCalled();
                case 'ArrowDown':
                    return expect(onArrowDown).toHaveBeenCalled();
                case 'ArrowLeft':
                    return expect(onArrowLeft).toHaveBeenCalled();
                case 'ArrowRight':
                    return expect(onArrowRight).toHaveBeenCalled();
                case 'ArrowUp':
                    return expect(onArrowUp).toHaveBeenCalled();
                case 'Delete':
                    return expect(onDelete).toHaveBeenCalled();
                case 'Enter':
                    return expect(onEnter).toHaveBeenCalled();
                case 'Escape':
                    return expect(onEscape).toHaveBeenCalled();
                case 'Tab':
                    return; // no explicit tab handler, tab events are handled by the registry.
                default:
                    return assertNever(event.key, `Unknown event key: ${event.key}`);
            }
        });

        expect.assertions(10);
    });

    test('no non navigation key down events can bouble from the focuser', () => {
        const onKeyDown = jest.fn();
        const { container } = render(
            <div onKeyDown={onKeyDown}>
                <Focuser focusKey="focuser" />
            </div>,
        );
        const focuser = container.querySelector('[name=focuser]') as HTMLInputElement;

        allNavigationEvents.forEach(event => fireEvent.keyDown(focuser, event));
        ['a', 'b', 'c', '1', '2', '3'].forEach(key => fireEvent.keyDown(focuser, { key }));

        expect(onKeyDown).toHaveBeenCalledTimes(allNavigationEvents.length);
    });

    test('all handled navigation events do not bouble from the focuser', () => {
        const onKeyDown = jest.fn();
        const handler = jest.fn();
        const { container } = render(
            <TabBoundary onKeyDown={onKeyDown}>
                <Focuser
                    focusKey="focuser"
                    onArrowDown={handler}
                    onArrowLeft={handler}
                    onArrowRight={handler}
                    onArrowUp={handler}
                    onDelete={handler}
                    onEnter={handler}
                    onEscape={handler}
                    onMinus={handler}
                    onPlus={handler}
                    onSpace={handler}
                />
            </TabBoundary>,
        );
        const focuser = container.querySelector('[name=focuser]') as HTMLInputElement;

        allNavigationEvents.forEach(event => fireEvent.keyDown(focuser, event));
        ['a', 'b', 'c', '1', '2', '3'].forEach(key => fireEvent.keyDown(focuser, { key }));

        expect(onKeyDown).not.toHaveBeenCalled();
    });
});
