import * as React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { Focuser as FocuserHooks } from '../../hooks/components/Focuser';
import { Section as SectionHooks } from '../../hooks/components/Section';
import { TabBoundary as TabBoundaryHooks } from '../../hooks/components/TabBoundary';
import { TabRegistry } from '../../TabRegistry';
import { Focuser as FocuserClassic } from '../Focuser';
import { Section as SectionClassic } from '../Section';
import { TabBoundary as TabBoundaryClassic } from '../TabBoundary';
import { expectInstanceOf } from './__helpers__/assert';
import { enter } from './__helpers__/event';

[
    {
        Focuser: FocuserClassic,
        Section: SectionClassic,
        TabBoundary: TabBoundaryClassic,
    },
    {
        Focuser: FocuserHooks,
        Section: SectionHooks,
        TabBoundary: TabBoundaryHooks,
    },
].forEach(components => {
    const Focuser = components.Focuser as typeof FocuserClassic;
    const Section = components.Section as typeof SectionClassic;
    const TabBoundary = components.TabBoundary as typeof TabBoundaryClassic;

    const suiteName = Focuser === FocuserClassic ? 'Classic' : 'Hooks';

    describe(`Section.${suiteName}`, () => {
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

            const sectionFocuser = expectInstanceOf(container.querySelector('[name=section]'), HTMLElement);
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

        test('fetching tab registry through ref object', () => {
            const tabRegistryRef = React.createRef<TabRegistry>();
            render(<Section focusKey="section" tabRegistryRef={tabRegistryRef} />);
            expect(tabRegistryRef.current).toBeInstanceOf(TabRegistry);
        });

        test('clicking on section focuses the section focuser on default configuration', () => {
            const { container } = render(<Section focusKey="section" />);
            const section = expectInstanceOf(container.firstElementChild, HTMLDivElement);
            fireEvent.click(section);
            const focusedElement = expectInstanceOf(container.querySelector(':focus'), HTMLInputElement);
            expect(focusedElement.name).toBe('section');
        });

        test('clicking on section focuses first focuser, when focusOnClick is set to first-child', () => {
            const { container } = render(
                <Section focusKey="section" focusOnClick="first-child">
                    <Focuser focusKey="field1" />
                    <Focuser focusKey="field2" />
                </Section>,
            );
            const section = expectInstanceOf(container.firstElementChild, HTMLDivElement);
            fireEvent.click(section);
            const focusedElement = expectInstanceOf(container.querySelector(':focus'), HTMLInputElement);
            expect(focusedElement.name).toBe('field1');
        });

        test('clicking on section focuses first focuser, when focusOnClick is set to last-child', () => {
            const { container } = render(
                <Section focusKey="section" focusOnClick="last-child">
                    <Focuser focusKey="field1" />
                    <Focuser focusKey="field2" />
                </Section>,
            );

            const section = expectInstanceOf(container.firstElementChild, HTMLDivElement);
            fireEvent.click(section);
            const focusedElement = expectInstanceOf(container.querySelector(':focus'), HTMLInputElement);
            expect(focusedElement.name).toBe('field2');
        });
    });
});
