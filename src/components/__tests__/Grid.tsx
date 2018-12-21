import * as React from 'react';
import { cleanup, render } from 'react-testing-library';
import { NavigationMap } from '../../FieldNavigation';
import { Focuser, NavigationKeyHandler } from '../Focuser';
import { Grid } from '../Grid';
import { Section } from '../Section';
import { expectInstanceOf } from './__helpers__/assert';
import { arrowDown, arrowLeft, arrowRight, arrowUp, tab } from './__helpers__/event';

describe('<Grid />', () => {
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
        const navigationMap: NavigationMap = [['section1'], ['section2']];
        const { container } = render(
            <Grid focusKey="grid" navigationMap={navigationMap}>
                {renderGrid}
            </Grid>,
        );

        const section1 = container.querySelector('.section1 [name=section-focuser]') as HTMLElement;
        const section2 = container.querySelector('.section2 [name=section-focuser]') as HTMLElement;

        arrowDown(section1);
        expect(onFocus2).toHaveBeenCalled();
        arrowUp(section2);
        expect(onFocus1).toHaveBeenCalled();
    });

    test('remount section should not throw', () => {
        const navigationMap: NavigationMap = [['section1', 'section2']];
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
            rerender(<Grid children={renderGrid} focusKey="grid" key="grid-remount" navigationMap={navigationMap} />);
        }).not.toThrowError();
    });

    test('three column grid arrow key navigation', () => {
        // prettier-ignore
        const navigationMap: NavigationMap = [
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
        const navigationMap: NavigationMap = [
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
        const navigationMap: NavigationMap = [
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
});
