import * as React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { TabRegistry } from '../../TabRegistry';
import { Focuser } from '../Focuser';
import { Section } from '../Section';
import { TabBoundary } from '../TabBoundary';
import { expectInstanceOf } from './__helpers__/assert';
import { enter } from './__helpers__/event';

describe('Section', () => {
    afterEach(cleanup);
    test('enter on section focuser, focuses first child focuser', () => {
        const onFocus = jest.fn();
        const { container } = render(
            <TabBoundary>
                <Section focusKey="section">
                    <Focuser focusKey="child1" onFocus={onFocus} />
                    <Focuser focusKey="child2" />
                </Section>
            </TabBoundary>,
        );

        const sectionFocuser = container.querySelector('[name=section]') as HTMLElement;
        expect(sectionFocuser).toBeInstanceOf(HTMLElement);

        enter(sectionFocuser);

        expect(onFocus).toHaveBeenCalled();
    });

    test('remount section should not throw', () => {
        const { rerender } = render(
            <>
                <Section focusKey="section1" key="section1" />
                <Section focusKey="section2" key="section2" />
            </>,
        );

        expect(() => {
            rerender(
                <>
                    <Section focusKey="section1" key="section1-remount" />
                    <Section focusKey="section2" key="section2" />
                </>,
            );
        }).not.toThrowError();
    });

    test('fetching tab registry through mutable ref object', () => {
        const tabRegistryRef = React.createRef<TabRegistry>();
        render(<Section focusKey="section" tabRegistryRef={tabRegistryRef} />);
        expect(tabRegistryRef.current).toBeInstanceOf(TabRegistry);
    });

    test('clicking on section focuses the section focuser on default configuration', () => {
        const { container } = render(<Section focusKey="section" />);
        fireEvent.click(container.firstElementChild as HTMLElement);
        const focusedElement = container.querySelector(':focus') as HTMLElement;
        expect(focusedElement).toBeDefined();
        expect(focusedElement.getAttribute('name')).toBe('section');
    });

    test('clicking on section focuses first focuser, when focusOnClick is set to first-child', () => {
        const { container } = render(
            <Section focusKey="section" focusOnClick="first-child">
                <Focuser focusKey="field1" />
                <Focuser focusKey="field2" />
            </Section>,
        );
        fireEvent.click(container.firstElementChild as HTMLElement);
        const focusedElement = container.querySelector(':focus') as HTMLElement;
        expect(focusedElement).toBeDefined();
        expect(focusedElement.getAttribute('name')).toBe('field1');
    });

    test('clicking on section focuses first focuser, when focusOnClick is set to last-child', () => {
        const { container } = render(
            <Section focusKey="section" focusOnClick="last-child">
                <Focuser focusKey="field1" />
                <Focuser focusKey="field2" />
            </Section>,
        );
        fireEvent.click(container.firstElementChild as HTMLElement);
        const focusedElement = expectInstanceOf(container.querySelector(':focus'), HTMLInputElement);
        expect(focusedElement.name).toBe('field2');
    });
});
