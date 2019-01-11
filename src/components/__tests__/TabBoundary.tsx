import React from 'react';
import { cleanup, render } from 'react-testing-library';
import { Focuser as FocuserHooks } from '../../hooks/components/Focuser';
import { TabBoundary as TabBoundaryHooks } from '../../hooks/components/TabBoundary';
import { TabRegistry } from '../../TabRegistry';
import { Focuser as FocuserClassic } from '../Focuser';
import { NavigationContext } from '../NavigationContext';
import { TabBoundary as TabBoundaryClassic } from '../TabBoundary';
import { expectInstanceOf } from './__helpers__/assert';
import { escape, shiftTab, space, tab } from './__helpers__/event';
[
    {
        Focuser: FocuserClassic,
        TabBoundary: TabBoundaryClassic,
    },
    {
        Focuser: FocuserHooks,
        TabBoundary: TabBoundaryHooks,
    },
].forEach(components => {
    const Focuser = components.Focuser as typeof FocuserClassic;
    const TabBoundary = components.TabBoundary as typeof TabBoundaryClassic;

    const suiteName = Focuser === FocuserClassic ? 'Classic' : 'Hooks';

    describe(`TabBoundary.${suiteName}`, () => {
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

        // tslint:disable-next-line:max-line-length
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

            const focuser2 = expectInstanceOf(container.querySelector('[name=focuser2]'), HTMLInputElement);
            const focuser3 = expectInstanceOf(container.querySelector('[name=focuser3]'), HTMLInputElement);

            tab(focuser2);
            expect(onFocus3).toHaveBeenCalledWith({ focusOrigin: 'prev' }, 'focuser3');
            shiftTab(focuser3);
            expect(onFocus2).toHaveBeenCalledWith({ focusOrigin: 'next' }, 'focuser2');
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

            const childFocuser2 = expectInstanceOf(container.querySelector('[name=child-focuser2]'), HTMLInputElement);
            escape(childFocuser2);

            expect(onFocusParent).toHaveBeenCalledWith({ focusOrigin: 'child' }, 'parent-focuser');
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

            const focuser1 = expectInstanceOf(container.querySelector('[name=focuser1]'), HTMLInputElement);
            const focuser3 = expectInstanceOf(container.querySelector('[name=focuser3]'), HTMLInputElement);

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

            const childFocuser2 = expectInstanceOf(container.querySelector('[name=child-focuser2]'), HTMLInputElement);
            space(childFocuser2);

            expect(onFocusParent).toHaveBeenCalledWith({ focusOrigin: 'child' }, 'parent-focuser');
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

        test('remount tab boundary should not throw', () => {
            const { rerender } = render(
                <>
                    <TabBoundary key="boundary1" />
                    <TabBoundary key="boundary2" />
                </>,
            );

            expect(() => {
                rerender(
                    <>
                        <TabBoundary key="boundary1-remount" />
                        <TabBoundary key="boundary2" />
                    </>,
                );
            }).not.toThrowError();
        });

        test('fetching tab registry through mutable ref object', () => {
            const tabRegistryRef = React.createRef<TabRegistry>();
            render(<TabBoundary tabRegistryRef={tabRegistryRef} />);
            expect(tabRegistryRef.current).toBeInstanceOf(TabRegistry);
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

        private renderWithTabRegistry = (tabRegistry: TabRegistry<string> | null) => {
            this.tabRegistry = tabRegistry;
            return <Focuser focusKey={this.props.focusKey} onFocus={this.props.onFocus} onSpace={this.focusParent} />;
        };

        public render() {
            return <NavigationContext.Consumer>{this.renderWithTabRegistry}</NavigationContext.Consumer>;
        }
    }
});
