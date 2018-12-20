import * as React from 'react';
import { cleanup, render } from 'react-testing-library';
import { TabRegistry } from '../../TabRegistry';
import { Focuser } from '../Focuser';
import { Section } from '../Section';
import { TabBoundary } from '../TabBoundary';
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

        const sectionFocuser = container.querySelector('[name=section-focuser]') as HTMLElement;
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
        const tabRegistryRef = React.createRef<TabRegistry | null>() as React.MutableRefObject<TabRegistry | null>;
        render(<Section focusKey="section" tabRegistryRef={tabRegistryRef} />);
        expect(tabRegistryRef.current).toBeInstanceOf(TabRegistry);
    });
});
