import * as React from 'react';
import { cleanup, render } from 'react-testing-library';
import { TabRegistry } from '../../TabRegistry';
import { Focuser } from '../Focuser';
import { NavigationContext, TabBoundary } from '../TabBoundary';
import { escape, shiftTab, space, tab } from './__helpers__/event';

describe('TabBoundary', () => {
    afterEach(cleanup);
    test('duplicate focus keys within same boundary throws', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {
            return;
        });
        expect(() =>
            render(
                <TabBoundary>
                    <Focuser focusKey="focuser" />
                    <Focuser focusKey="focuser" />
                </TabBoundary>,
            ),
        ).toThrowErrorMatchingSnapshot();
        (console as any).error.mockRestore();
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

    test('boundary with cycle enabled, focus the first/last focuser when crossing boundaries', () => {
        const onFocus1 = jest.fn();
        const onFocus2 = jest.fn();
        const onFocus3 = jest.fn();

        const { container } = render(
            <TabBoundary cycle={true}>
                <Focuser focusKey="focuser1" onFocus={onFocus1} />
                <Focuser focusKey="focuser2" onFocus={onFocus2} />
                <Focuser focusKey="focuser3" onFocus={onFocus3} />
            </TabBoundary>,
        );

        const focuser1 = container.querySelector('[name=focuser1]') as HTMLInputElement;
        const focuser3 = container.querySelector('[name=focuser3]') as HTMLInputElement;

        tab(focuser3);
        expect(onFocus1).toHaveBeenCalled();

        shiftTab(focuser1);
        expect(onFocus3).toHaveBeenCalled();

        expect(onFocus2).not.toHaveBeenCalled();
    });

    test('focus parent on child origin focuses the first focuser in the parent registry', () => {
        const onFocusParent = jest.fn();
        const { container } = render(
            <TabBoundary>
                <Focuser focusKey="parent-focuser" onFocus={onFocusParent} />
                <TabBoundary boundaryKey="child-boundary" focusParentOnChildOrigin={true}>
                    <Focuser focusKey="child-focuser1" />
                    <FocusParentOnSpace focusKey="child-focuser2" />
                </TabBoundary>
            </TabBoundary>,
        );

        const childFocuser2 = container.querySelector('[name=child-focuser2]') as HTMLInputElement;
        space(childFocuser2);

        expect(onFocusParent).toHaveBeenCalledWith({ focusOrigin: 'child' });
    });

    test('duplicate keys in sibling boundary does not throw', () => {
        expect(() =>
            render(
                <div>
                    <TabBoundary boundaryKey="sibling-1">
                        <Focuser focusKey="duplicate-1" />
                        <Focuser focusKey="duplicate-2" />
                    </TabBoundary>
                    <TabBoundary boundaryKey="sibling-2">
                        <Focuser focusKey="duplicate-1" />
                        <Focuser focusKey="duplicate-2" />
                    </TabBoundary>
                </div>,
            ),
        ).not.toThrowError();
    });
});

class FocusParentOnSpace extends React.Component<{ focusKey: string; onFocus?: () => void }> {
    private tabRegistry: TabRegistry | null = null;

    public componentWillUnmount() {
        this.tabRegistry = null;
    }

    private focusParent = () => {
        if (this.tabRegistry != null) {
            this.tabRegistry.focusParent();
        }
    };

    public render() {
        return (
            <NavigationContext.Consumer>
                {tabRegistry => {
                    this.tabRegistry = tabRegistry;
                    return (
                        <Focuser
                            focusKey={this.props.focusKey}
                            onFocus={this.props.onFocus}
                            onSpace={this.focusParent}
                        />
                    );
                }}
            </NavigationContext.Consumer>
        );
    }
}
