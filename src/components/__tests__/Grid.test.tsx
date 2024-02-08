/** @jest-environment jsdom */
import { cleanup, render } from '@testing-library/react';
import { Focuser as FocuserClassic } from '@zeroconf/keyboard-navigation/components/Focuser';
import type { NavigationKeyHandler } from '@zeroconf/keyboard-navigation/components/Focuser';
import { Grid as GridClassic } from '@zeroconf/keyboard-navigation/components/Grid';
import { Section as SectionClassic } from '@zeroconf/keyboard-navigation/components/Section';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/helpers/assert';
import {
    arrowDown,
    arrowLeft,
    arrowRight,
    arrowUp,
    shiftTab,
    tab,
} from '@zeroconf/keyboard-navigation/components/__tests__/helpers/event';
import type { NavigationFieldMap } from '@zeroconf/keyboard-navigation/FieldNavigation';
import { Focuser as FocuserHooks } from '@zeroconf/keyboard-navigation/hooks/components/Focuser';
import { Grid as GridHooks } from '@zeroconf/keyboard-navigation/hooks/components/Grid';
import { Section as SectionHooks } from '@zeroconf/keyboard-navigation/hooks/components/Section';

[
    {
        Focuser: FocuserClassic,
        Grid: GridClassic,
        Section: SectionClassic,
    },
    {
        Focuser: FocuserHooks,
        Grid: GridHooks,
        Section: SectionHooks,
    },
].forEach((components) => {
    const Focuser = components.Focuser as typeof FocuserClassic;
    const Grid = components.Grid as typeof GridClassic;
    const Section = components.Section as typeof SectionClassic;

    const suiteName = Focuser === FocuserClassic ? 'Classic' : 'Hooks';

    describe(`Grid.${suiteName}`, () => {
        afterEach(cleanup);

        test('focus between sections in a column', () => {
            const onFocus1 = jest.fn();
            const onFocus2 = jest.fn();
            const renderGrid = (navigationHandler: NavigationKeyHandler) => (
                <>
                    <Section
                        className="section1"
                        focusKey="section1"
                        key="section1"
                        navigationHandler={navigationHandler}
                        onFocus={onFocus1}
                    />
                    <Section
                        className="section2"
                        focusKey="section2"
                        key="section2"
                        navigationHandler={navigationHandler}
                        onFocus={onFocus2}
                    />
                </>
            );
            const navigationMap: NavigationFieldMap = [['section1'], ['section2']];
            const { container } = render(
                <Grid focusKey="grid" navigationMap={navigationMap}>
                    {renderGrid}
                </Grid>,
            );

            const section1 = container.querySelector('.section1 [name=section1]') as HTMLElement;
            const section2 = container.querySelector('.section2 [name=section2]') as HTMLElement;

            arrowDown(section1);
            expect(onFocus2).toHaveBeenCalled();
            arrowUp(section2);
            expect(onFocus1).toHaveBeenCalled();
        });

        test('remount section should not throw', () => {
            const navigationMap: NavigationFieldMap = [['section1', 'section2']];
            const renderGrid = () => (
                <>
                    <Section focusKey="section1" />
                    <Section focusKey="section2" />
                </>
            );

            const { rerender } = render(
                <Grid children={renderGrid} focusKey="grid" key="grid" navigationMap={navigationMap} />,
            );

            expect(() => {
                rerender(
                    <Grid children={renderGrid} focusKey="grid" key="grid-remount" navigationMap={navigationMap} />,
                );
            }).not.toThrowError();
        });

        test('three column grid arrow key navigation', () => {
            // prettier-ignore
            const navigationMap: NavigationFieldMap = [
                ['focuser1', 'focuser2', 'focuser3'],
                ['focuser4', 'focuser5', 'focuser6'],
                ['focuser7', 'focuser8', 'focuser9'],
            ];

            // prettier-ignore
            const onFocus = {
                focuser1: jest.fn(), focuser2: jest.fn(), focuser3: jest.fn(),
                focuser4: jest.fn(), focuser5: jest.fn(), focuser6: jest.fn(),
                focuser7: jest.fn(), focuser8: jest.fn(), focuser9: jest.fn(),
            };

            const renderGrid = (navigationHandler: NavigationKeyHandler) => (
                <>
                    <div className="row">
                        <Focuser focusKey="focuser1" onFocus={onFocus.focuser1} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser2" onFocus={onFocus.focuser2} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser3" onFocus={onFocus.focuser3} onNavigationKeys={navigationHandler} />
                    </div>
                    <div className="row">
                        <Focuser focusKey="focuser4" onFocus={onFocus.focuser4} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser5" onFocus={onFocus.focuser5} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser6" onFocus={onFocus.focuser6} onNavigationKeys={navigationHandler} />
                    </div>
                    <div className="row">
                        <Focuser focusKey="focuser7" onFocus={onFocus.focuser7} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser8" onFocus={onFocus.focuser8} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser9" onFocus={onFocus.focuser9} onNavigationKeys={navigationHandler} />
                    </div>
                </>
            );

            const { container } = render(<Grid children={renderGrid} focusKey="grid" navigationMap={navigationMap} />);

            const focuser1 = expectInstanceOf(container.querySelector('input[name=focuser1]'), HTMLInputElement);
            const focuser2 = expectInstanceOf(container.querySelector('input[name=focuser2]'), HTMLInputElement);
            const focuser3 = expectInstanceOf(container.querySelector('input[name=focuser3]'), HTMLInputElement);
            const focuser4 = expectInstanceOf(container.querySelector('input[name=focuser4]'), HTMLInputElement);
            const focuser6 = expectInstanceOf(container.querySelector('input[name=focuser6]'), HTMLInputElement);
            const focuser7 = expectInstanceOf(container.querySelector('input[name=focuser7]'), HTMLInputElement);
            const focuser8 = expectInstanceOf(container.querySelector('input[name=focuser8]'), HTMLInputElement);
            const focuser9 = expectInstanceOf(container.querySelector('input[name=focuser9]'), HTMLInputElement);

            arrowRight(focuser1);
            expect(onFocus.focuser2).toHaveBeenCalledWith({ focusOrigin: 'left' }, 'focuser2');

            arrowRight(focuser2);
            expect(onFocus.focuser3).toHaveBeenCalledWith({ focusOrigin: 'left' }, 'focuser3');

            arrowDown(focuser3);
            expect(onFocus.focuser6).toHaveBeenCalledWith({ focusOrigin: 'up' }, 'focuser6');

            arrowDown(focuser6);
            expect(onFocus.focuser9).toHaveBeenCalledWith({ focusOrigin: 'up' }, 'focuser9');

            arrowLeft(focuser9);
            expect(onFocus.focuser8).toHaveBeenCalledWith({ focusOrigin: 'right' }, 'focuser8');

            arrowLeft(focuser8);
            expect(onFocus.focuser7).toHaveBeenCalledWith({ focusOrigin: 'right' }, 'focuser7');

            arrowUp(focuser7);
            expect(onFocus.focuser4).toHaveBeenCalledWith({ focusOrigin: 'down' }, 'focuser4');

            arrowUp(focuser4);
            expect(onFocus.focuser1).toHaveBeenCalledWith({ focusOrigin: 'down' }, 'focuser1');

            expect(onFocus.focuser5).not.toHaveBeenCalled();
        });

        test('three column grid tab navigation in x-axis direction', () => {
            // prettier-ignore
            const navigationMap: NavigationFieldMap = [
                ['focuser1', 'focuser2', 'focuser3'],
                ['focuser4', 'focuser5', 'focuser6'],
                ['focuser7', 'focuser8', 'focuser9'],
            ];

            // prettier-ignore
            const onFocus = {
                focuser1: jest.fn(), focuser2: jest.fn(), focuser3: jest.fn(),
                focuser4: jest.fn(), focuser5: jest.fn(), focuser6: jest.fn(),
                focuser7: jest.fn(), focuser8: jest.fn(), focuser9: jest.fn(),
            };

            const renderGrid = (navigationHandler: NavigationKeyHandler) => (
                <>
                    <div className="row">
                        <Focuser focusKey="focuser1" onFocus={onFocus.focuser1} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser2" onFocus={onFocus.focuser2} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser3" onFocus={onFocus.focuser3} onNavigationKeys={navigationHandler} />
                    </div>
                    <div className="row">
                        <Focuser focusKey="focuser4" onFocus={onFocus.focuser4} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser5" onFocus={onFocus.focuser5} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser6" onFocus={onFocus.focuser6} onNavigationKeys={navigationHandler} />
                    </div>
                    <div className="row">
                        <Focuser focusKey="focuser7" onFocus={onFocus.focuser7} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser8" onFocus={onFocus.focuser8} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser9" onFocus={onFocus.focuser9} onNavigationKeys={navigationHandler} />
                    </div>
                </>
            );

            const { container } = render(<Grid children={renderGrid} focusKey="grid" navigationMap={navigationMap} />);

            const focuser1 = expectInstanceOf(container.querySelector('input[name=focuser1]'), HTMLInputElement);
            const focuser2 = expectInstanceOf(container.querySelector('input[name=focuser2]'), HTMLInputElement);
            const focuser3 = expectInstanceOf(container.querySelector('input[name=focuser3]'), HTMLInputElement);
            const focuser4 = expectInstanceOf(container.querySelector('input[name=focuser4]'), HTMLInputElement);
            const focuser5 = expectInstanceOf(container.querySelector('input[name=focuser5]'), HTMLInputElement);
            const focuser6 = expectInstanceOf(container.querySelector('input[name=focuser6]'), HTMLInputElement);
            const focuser7 = expectInstanceOf(container.querySelector('input[name=focuser7]'), HTMLInputElement);
            const focuser8 = expectInstanceOf(container.querySelector('input[name=focuser8]'), HTMLInputElement);
            const focuser9 = expectInstanceOf(container.querySelector('input[name=focuser9]'), HTMLInputElement);

            tab(focuser1);
            expect(onFocus.focuser2).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser2');
            tab(focuser2);
            expect(onFocus.focuser3).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser3');

            tab(focuser3);
            expect(onFocus.focuser4).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser4');
            tab(focuser4);
            expect(onFocus.focuser5).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser5');
            tab(focuser5);
            expect(onFocus.focuser6).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser6');

            tab(focuser6);
            expect(onFocus.focuser7).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser7');
            tab(focuser7);
            expect(onFocus.focuser8).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser8');
            tab(focuser8);
            expect(onFocus.focuser9).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser9');

            tab(focuser9);
            expect(onFocus.focuser1).not.toHaveBeenCalled();
            expect(container.querySelector(':focus')).toBe(focuser9);
        });

        test('three column grid tab navigation in y-axis direction', () => {
            // prettier-ignore
            const navigationMap: NavigationFieldMap = [
                ['focuser1', 'focuser2', 'focuser3'],
                ['focuser4', 'focuser5', 'focuser6'],
                ['focuser7', 'focuser8', 'focuser9'],
            ];

            // prettier-ignore
            const onFocus = {
                focuser1: jest.fn(), focuser2: jest.fn(), focuser3: jest.fn(),
                focuser4: jest.fn(), focuser5: jest.fn(), focuser6: jest.fn(),
                focuser7: jest.fn(), focuser8: jest.fn(), focuser9: jest.fn(),
            };

            const renderGrid = (navigationHandler: NavigationKeyHandler) => (
                <>
                    <div className="row">
                        <Focuser focusKey="focuser1" onFocus={onFocus.focuser1} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser2" onFocus={onFocus.focuser2} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser3" onFocus={onFocus.focuser3} onNavigationKeys={navigationHandler} />
                    </div>
                    <div className="row">
                        <Focuser focusKey="focuser4" onFocus={onFocus.focuser4} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser5" onFocus={onFocus.focuser5} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser6" onFocus={onFocus.focuser6} onNavigationKeys={navigationHandler} />
                    </div>
                    <div className="row">
                        <Focuser focusKey="focuser7" onFocus={onFocus.focuser7} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser8" onFocus={onFocus.focuser8} onNavigationKeys={navigationHandler} />
                        <Focuser focusKey="focuser9" onFocus={onFocus.focuser9} onNavigationKeys={navigationHandler} />
                    </div>
                </>
            );

            const { container } = render(
                <Grid children={renderGrid} focusKey="grid" navigationMap={navigationMap} tabDirectionAxis="y" />,
            );

            const focuser1 = expectInstanceOf(container.querySelector('input[name=focuser1]'), HTMLInputElement);
            const focuser2 = expectInstanceOf(container.querySelector('input[name=focuser2]'), HTMLInputElement);
            const focuser3 = expectInstanceOf(container.querySelector('input[name=focuser3]'), HTMLInputElement);
            const focuser4 = expectInstanceOf(container.querySelector('input[name=focuser4]'), HTMLInputElement);
            const focuser5 = expectInstanceOf(container.querySelector('input[name=focuser5]'), HTMLInputElement);
            const focuser6 = expectInstanceOf(container.querySelector('input[name=focuser6]'), HTMLInputElement);
            const focuser7 = expectInstanceOf(container.querySelector('input[name=focuser7]'), HTMLInputElement);
            const focuser8 = expectInstanceOf(container.querySelector('input[name=focuser8]'), HTMLInputElement);
            const focuser9 = expectInstanceOf(container.querySelector('input[name=focuser9]'), HTMLInputElement);

            tab(focuser1);
            expect(onFocus.focuser4).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser4');
            tab(focuser4);
            expect(onFocus.focuser7).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser7');

            tab(focuser7);
            expect(onFocus.focuser2).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser2');
            tab(focuser2);
            expect(onFocus.focuser5).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser5');
            tab(focuser5);
            expect(onFocus.focuser8).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser8');

            tab(focuser8);
            expect(onFocus.focuser3).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser3');
            tab(focuser3);
            expect(onFocus.focuser6).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser6');
            tab(focuser6);
            expect(onFocus.focuser9).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser9');

            tab(focuser9);
            expect(onFocus.focuser1).not.toHaveBeenCalled();
            expect(container.querySelector(':focus')).toBe(focuser9);
        });

        test('navigate backwards using shift tab in x-axis grid', () => {
            // prettier-ignore
            const navigationMap: NavigationFieldMap = [
                ['section1', 'section2'],
                ['section3', 'section4'],
            ];

            // prettier-ignore
            const onFocus = {
                section1: jest.fn(), section2: jest.fn(),
                section3: jest.fn(), section4: jest.fn(),
            };

            const renderGrid = (navigationHandler: NavigationKeyHandler) => (
                <div className="grid-content">
                    <div className="row">
                        <Section focusKey="section1" navigationHandler={navigationHandler} onFocus={onFocus.section1}>
                            <Section focusKey="inner-section1" />
                        </Section>
                        <Section focusKey="section2" navigationHandler={navigationHandler} onFocus={onFocus.section2}>
                            <div />
                        </Section>
                    </div>
                    <div className="row">
                        <Section focusKey="section3" navigationHandler={navigationHandler} onFocus={onFocus.section3}>
                            <div />
                        </Section>
                        <Section focusKey="section4" navigationHandler={navigationHandler} onFocus={onFocus.section4}>
                            <div />
                        </Section>
                    </div>
                </div>
            );

            const { container } = render(
                <Grid children={renderGrid} focusKey="grid" navigationMap={navigationMap} tabDirectionAxis="x" />,
            );

            const section1 = expectInstanceOf(container.querySelector('input[name=section1]'), HTMLInputElement);
            const section2 = expectInstanceOf(container.querySelector('input[name=section2]'), HTMLInputElement);
            const section3 = expectInstanceOf(container.querySelector('input[name=section3]'), HTMLInputElement);
            const section4 = expectInstanceOf(container.querySelector('input[name=section4]'), HTMLInputElement);

            shiftTab(section4);
            expect(onFocus.section3).toHaveBeenCalledWith(
                { focusOrigin: 'next', focusFirstOnNextOrigin: true },
                'section3',
            );
            shiftTab(section3);
            expect(onFocus.section2).toHaveBeenCalledWith(
                { focusOrigin: 'next', focusFirstOnNextOrigin: true },
                'section2',
            );

            shiftTab(section2);
            expect(onFocus.section1).toHaveBeenCalledWith(
                { focusOrigin: 'next', focusFirstOnNextOrigin: true },
                'section1',
            );
            shiftTab(section1);

            expect(onFocus.section4).not.toHaveBeenCalled();
            expect(container.querySelector(':focus')).toBe(section1);
        });

        test('navigate backwards using shift tab in y-axis grid', () => {
            // prettier-ignore
            const navigationMap: NavigationFieldMap = [
                ['section1', 'section2'],
                ['section3', 'section4'],
            ];

            // prettier-ignore
            const onFocus = {
                section1: jest.fn(), section2: jest.fn(),
                section3: jest.fn(), section4: jest.fn(),
            };

            const renderGrid = (navigationHandler: NavigationKeyHandler) => (
                <div className="grid-content">
                    <div className="row">
                        <Section focusKey="section1" navigationHandler={navigationHandler} onFocus={onFocus.section1}>
                            <Section focusKey="inner-section1" />
                        </Section>
                        <Section focusKey="section2" navigationHandler={navigationHandler} onFocus={onFocus.section2}>
                            <div />
                        </Section>
                    </div>
                    <div className="row">
                        <Section focusKey="section3" navigationHandler={navigationHandler} onFocus={onFocus.section3}>
                            <div />
                        </Section>
                        <Section focusKey="section4" navigationHandler={navigationHandler} onFocus={onFocus.section4}>
                            <div />
                        </Section>
                    </div>
                </div>
            );

            const { container } = render(
                <Grid children={renderGrid} focusKey="grid" navigationMap={navigationMap} tabDirectionAxis="y" />,
            );

            const section1 = expectInstanceOf(container.querySelector('input[name=section1]'), HTMLInputElement);
            const section2 = expectInstanceOf(container.querySelector('input[name=section2]'), HTMLInputElement);
            const section3 = expectInstanceOf(container.querySelector('input[name=section3]'), HTMLInputElement);
            const section4 = expectInstanceOf(container.querySelector('input[name=section4]'), HTMLInputElement);

            shiftTab(section4);
            expect(onFocus.section2).toHaveBeenCalledWith(
                { focusOrigin: 'next', focusFirstOnNextOrigin: true },
                'section2',
            );
            shiftTab(section2);
            expect(onFocus.section3).toHaveBeenCalledWith(
                { focusOrigin: 'next', focusFirstOnNextOrigin: true },
                'section3',
            );

            shiftTab(section3);
            expect(onFocus.section1).toHaveBeenCalledWith(
                { focusOrigin: 'next', focusFirstOnNextOrigin: true },
                'section1',
            );
            shiftTab(section1);

            expect(onFocus.section4).not.toHaveBeenCalled();
            expect(container.querySelector(':focus')).toBe(section1);
        });

        test('grid can be rendered as another host component', () => {
            const renderGrid = () => <div />;
            const navigationMap: [string][] = [['field1']];
            const { container } = render(
                <Grid as="details" children={renderGrid} focusKey="grid" navigationMap={navigationMap} />,
            );
            expectInstanceOf(container.firstElementChild, HTMLDetailsElement);
        });
    });
});
