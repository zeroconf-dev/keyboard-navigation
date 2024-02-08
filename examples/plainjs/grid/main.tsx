import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid } from '../../../src/components/Grid';
import { Section, TabBoundary } from '../../../src/classic';

const navigationMap: [string, string][] = [['section1', 'section2'], ['section3', 'section4']];

class App extends React.Component {
    private renderGrid = navigationHandler => {
        return (
            <div className="grid-content">
                <div className="row">
                    <Section autoFocus={true} focusKey="section1" navigationHandler={navigationHandler}>
                        <Section focusKey="inner-section1" />
                    </Section>
                    <Section focusKey="section2" navigationHandler={navigationHandler}>
                        <div />
                    </Section>
                </div>
                <div className="row">
                    <Section focusKey="section3" navigationHandler={navigationHandler}>
                        <div />
                    </Section>
                    <Section focusKey="section4" navigationHandler={navigationHandler}>
                        <div />
                    </Section>
                </div>
            </div>
        );
    };
    public render() {
        return (
            <TabBoundary>
                <Grid className="grid" focusKey="grid" navigationMap={navigationMap}>
                    {this.renderGrid}
                </Grid>
            </TabBoundary>
        );
    }
}

ReactDOM.render(React.createElement(App) as any, document.querySelector('#root'));
