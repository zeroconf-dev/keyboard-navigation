import * as React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { assertNever } from '../../util';
import { Focuser } from '../Focuser';
import { TabBoundary } from '../TabBoundary';

function tab(focuser: HTMLInputElement) {
    fireEvent.keyDown(focuser, { key: 'Tab', shiftKey: false });
}

function shiftTab(focuser: HTMLInputElement) {
    fireEvent.keyDown(focuser, { key: 'Tab', shiftKey: true });
}

function escape(focuser: HTMLInputElement) {
    fireEvent.keyDown(focuser, { key: 'Escape' });
}

describe('TabBoundary', () => {
    afterEach(cleanup);
    test('duplicate focus keys within same boundary throws', () => {
        expect(() =>
            render(
                <TabBoundary>
                    <Focuser focusKey="focuser" />
                    <Focuser focusKey="focuser" />
                </TabBoundary>,
            ),
        ).toThrowErrorMatchingSnapshot();
        expect(cleanup).toThrowErrorMatchingSnapshot();
    });

    test(`tab beyond last focuser in boundary, focuses sibling boundary's "next" focuser in the tab direction`, () => {
        const onFocus1 = jest.fn();
        const onFocus2 = jest.fn();
        const onFocus3 = jest.fn();
        const onFocus4 = jest.fn();

        const { container } = render(
            <TabBoundary>
                <TabBoundary boundaryKey="a">
                    <Focuser focusKey="focuser1" onFocus={onFocus1} />
                    <Focuser focusKey="focuser2" onFocus={onFocus2} />
                </TabBoundary>
                <TabBoundary boundaryKey="b">
                    <Focuser focusKey="focuser3" onFocus={onFocus3} />
                    <Focuser focusKey="focuser4" onFocus={onFocus4} />
                </TabBoundary>
            </TabBoundary>,
        );

        const focuser2 = container.querySelector('[name=focuser2]') as HTMLInputElement;
        const focuser3 = container.querySelector('[name=focuser3]') as HTMLInputElement;

        tab(focuser2);
        expect(onFocus3).toHaveBeenCalledWith({ focusOrigin: 'prev' });
        shiftTab(focuser3);
        expect(onFocus2).toHaveBeenCalledWith({ focusOrigin: 'next' });
    });

    test('focus parent on escape focuses first focuser of parent boundary', () => {
        const onFocusParent = jest.fn();
        const { container } = render(
            <TabBoundary>
                <Focuser focusKey="parent-focuser" onFocus={onFocusParent} />
                <TabBoundary boundaryKey="child-boundary" focusParentOnEscape={true}>
                    <Focuser focusKey="child-focuser1" />
                    <Focuser focusKey="child-focuser2" />
                </TabBoundary>
            </TabBoundary>,
        );

        const childFocuser2 = container.querySelector('[name=child-focuser2]') as HTMLInputElement;
        escape(childFocuser2);

        expect(onFocusParent).toHaveBeenCalledWith({ focusOrigin: 'child' });
    });
});
