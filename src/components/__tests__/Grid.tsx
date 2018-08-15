import * as React from 'react';
import { cleanup, render } from 'react-testing-library';
import { FieldMap } from '../../FieldNavigation';
import { ArrowKey } from '../Focuser';
import { Grid } from '../Grid';
import { Section } from '../Section';
import { TabBoundary } from '../TabBoundary';
import { arrowDown, arrowUp } from './__helpers__/event';

describe('<Grid />', () => {
    afterEach(cleanup);

    test('focus between sections in a column', () => {
        const onFocus1 = jest.fn();
        const onFocus2 = jest.fn();
        const renderGrid = (navigationHandler: (focusKey: string, arrowKey: ArrowKey) => void) => (
            <div>
                <Section
                    className="section1"
                    focusKey="section1"
                    navigationHandler={navigationHandler}
                    onFocus={onFocus1}
                />
                <Section
                    className="section2"
                    focusKey="section2"
                    navigationHandler={navigationHandler}
                    onFocus={onFocus2}
                />
            </div>
        );
        const fieldMap: FieldMap<string> = [['section1'], ['section2']];
        const { container } = render(
            <TabBoundary>
                <Grid fieldMap={fieldMap} focusKey="grid">
                    {renderGrid}
                </Grid>
            </TabBoundary>,
        );

        const section1 = container.querySelector('.section1 [name=section-focuser]') as HTMLElement;
        const section2 = container.querySelector('.section2 [name=section-focuser]') as HTMLElement;

        arrowDown(section1);
        expect(onFocus2).toHaveBeenCalled();
        arrowUp(section2);
        expect(onFocus1).toHaveBeenCalled();
    });
});
