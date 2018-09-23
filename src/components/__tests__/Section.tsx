import * as React from 'react';
import { cleanup, render } from 'react-testing-library';
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
});
