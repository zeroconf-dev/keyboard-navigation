import { act as testAct, cleanup, fireEvent, render, RenderResult } from '@testing-library/react';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/__helpers__/assert';
import { escape, shiftTab, space, tab } from '@zeroconf/keyboard-navigation/components/__tests__/__helpers__/event';
import { Focuser as FocuserClassic } from '@zeroconf/keyboard-navigation/components/Focuser';
import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { Input } from '@zeroconf/keyboard-navigation/components/Tabbable';
import { TabBoundary as TabBoundaryClassic } from '@zeroconf/keyboard-navigation/components/TabBoundary';
import { Focuser as FocuserHooks } from '@zeroconf/keyboard-navigation/hooks/components/Focuser';
import { TabBoundary as TabBoundaryHooks } from '@zeroconf/keyboard-navigation/hooks/components/TabBoundary';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import * as React from 'react';
import { act as domAct } from 'react-dom/test-utils';

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

            const errorRef = React.createRef() as React.MutableRefObject<any>;
            class ErrorBoundary extends React.Component {
                public componentDidCatch(error: any) {
                    errorRef.current = error;
                }
                public render() {
                    return this.props.children;
                }
            }

            testAct(() => {
                render(
                    <ErrorBoundary>
                        <TabBoundary>
                            <Focuser focusKey="focuser" />
                            <Focuser focusKey="focuser" />
                        </TabBoundary>
                    </ErrorBoundary>,
                );
            });

            expect(errorRef.current).toMatchSnapshot();
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
            expect(onFocus2).toHaveBeenCalledWith({ focusOrigin: 'next', focusFirstOnNextOrigin: false }, 'focuser2');
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

        test('on key down callback is called', () => {
            const onKeyDown = jest.fn();
            const { container } = render(<TabBoundary onKeyDown={onKeyDown} />);
            const boundary = expectInstanceOf(container.firstChild, HTMLDivElement);
            fireEvent.keyDown(boundary, { key: 'any' });
            expect(onKeyDown).toHaveBeenCalled();
        });

        test('focus prev/next in boundary via Tab keys', () => {
            const onFocus1 = jest.fn();
            const onFocus2 = jest.fn();
            const { container } = render(
                <TabBoundary>
                    <Input name="focuser1" onFocus={onFocus1} />
                    <Input name="focuser2" onFocus={onFocus2} />
                </TabBoundary>,
            );
            const input1 = expectInstanceOf(container.querySelector('[name=focuser1]'), HTMLInputElement);
            const input2 = expectInstanceOf(container.querySelector('[name=focuser2]'), HTMLInputElement);

            fireEvent.keyDown(input1, { key: 'Tab' });
            expect(onFocus2).toHaveBeenCalled();

            fireEvent.keyDown(input2, { key: 'Tab', shiftKey: true });
            expect(onFocus1).toHaveBeenCalled();
        });

        test('can change focusFirstOnNextOrigin between renders', () => {
            const onFocus1 = jest.fn();
            const onFocus2 = jest.fn();
            const { container, rerender } = render(
                <TabBoundary>
                    <TabBoundary boundaryKey="first" focusFirstOnNextOrigin={false}>
                        <Input name="input1" onFocus={onFocus1} />
                        <Input name="input2" onFocus={onFocus2} />
                    </TabBoundary>
                    <Input name="input3" />
                </TabBoundary>,
            );

            const input3 = expectInstanceOf(container.querySelector('[name=input3]'), HTMLInputElement);

            shiftTab(input3);
            expect(onFocus2).toHaveBeenCalled();

            rerender(
                <TabBoundary>
                    <TabBoundary boundaryKey="first" focusFirstOnNextOrigin={true}>
                        <Input name="input1" onFocus={onFocus1} />
                        <Input name="input2" onFocus={onFocus2} />
                    </TabBoundary>
                    <Input name="input3" />
                </TabBoundary>,
            );

            shiftTab(input3);
            expect(onFocus1).toHaveBeenCalled();
        });

        test('can change cycle between renders', () => {
            const onFocus1 = jest.fn();
            const onFocus2 = jest.fn();
            const { container, rerender } = render(
                <TabBoundary cycle={false}>
                    <Input name="input1" onFocus={onFocus1} />
                    <Input name="input2" onFocus={onFocus2} />
                </TabBoundary>,
            );

            const input2 = expectInstanceOf(container.querySelector('[name=input2]'), HTMLInputElement);

            tab(input2);
            expect(onFocus1).not.toHaveBeenCalled();

            rerender(
                <TabBoundary cycle={true}>
                    <Input name="input1" onFocus={onFocus1} />
                    <Input name="input2" onFocus={onFocus2} />
                </TabBoundary>,
            );

            tab(input2);
            expect(onFocus1).toHaveBeenCalled();

            rerender(
                <TabBoundary cycle={false}>
                    <Input name="input1" onFocus={onFocus1} />
                    <Input name="input2" onFocus={onFocus2} />
                </TabBoundary>,
            );

            tab(input2);
            expect(onFocus1).toHaveBeenCalledTimes(1);
        });

        test('can change focus parent on child origin between renders', () => {
            const onFocus1 = jest.fn();
            const onFocus2 = jest.fn();
            const onFocus3 = jest.fn();

            const tabRegistryRef = React.createRef<TabRegistry>();

            const { rerender } = render(
                <TabBoundary boundaryKey="outer">
                    <Input name="input1" onFocus={onFocus1} />
                    <TabBoundary boundaryKey="inner" focusParentOnChildOrigin={false} tabRegistryRef={tabRegistryRef}>
                        <Input name="input2" onFocus={onFocus2} />
                        <Input name="input3" onFocus={onFocus3} />
                    </TabBoundary>
                </TabBoundary>,
            );

            let tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);
            tabRegistry.focus(undefined, { focusOrigin: 'child' });

            expect(onFocus2).toHaveBeenCalled();

            rerender(
                <TabBoundary boundaryKey="outer">
                    <Input name="input1" onFocus={onFocus1} />
                    <TabBoundary boundaryKey="inner" focusParentOnChildOrigin={true} tabRegistryRef={tabRegistryRef}>
                        <Input name="input2" onFocus={onFocus2} />
                        <Input name="input3" onFocus={onFocus3} />
                    </TabBoundary>
                </TabBoundary>,
            );

            tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);

            tabRegistry.focus(undefined, { focusOrigin: 'child' });
            expect(onFocus1).toHaveBeenCalled();
        });

        test('can change boundary key between renders', () => {
            const tabRegistryRef = React.createRef<TabRegistry>();
            domAct(() => {
                let rerender: RenderResult['rerender'];
                testAct(() => {
                    const res = render(
                        <TabBoundary boundaryKey="outer" tabRegistryRef={tabRegistryRef}>
                            <TabBoundary boundaryKey="inner" />
                        </TabBoundary>,
                    );
                    rerender = res.rerender;
                });

                const tr = expectInstanceOf(tabRegistryRef.current, TabRegistry);
                expect(tr.has('inner')).toBe(true);
                expect(tr.has('inner-new')).toBe(false);

                testAct(() => {
                    rerender(
                        <TabBoundary boundaryKey="outer" tabRegistryRef={tabRegistryRef}>
                            <TabBoundary boundaryKey="inner-new" />
                        </TabBoundary>,
                    );
                });
            });
            const tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);
            expect(tabRegistry.has('inner')).toBe(false);
            expect(tabRegistry.has('inner-new')).toBe(true);
        });

        test('bonundary can be rendered as another host component', () => {
            const { container } = render(<TabBoundary as="details" />);
            expectInstanceOf(container.firstElementChild, HTMLDetailsElement);
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
