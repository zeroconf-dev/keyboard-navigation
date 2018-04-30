import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Input, Select, TabBoundary } from '../../../src/index';

class App extends React.Component {
    private refBoundary: TabBoundary | null = null;
    private focusFirst = (e: React.MouseEvent<HTMLInputElement>) => {
        // this is not the real implementation
        // but a quick hack to proof that the concept works.
        if (this.refBoundary != null) {
            this.refBoundary.getChildContext().tabRegistry.focusFirst();
        }
    };

    private preventDefault = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

    private setBoundaryRef = (ref: TabBoundary | null) => {
        this.refBoundary = ref;
    };

    public render() {
        return (
            // tslint:disable-next-line:jsx-no-lambda
            <form onSubmit={this.preventDefault}>
                <TabBoundary cycle={true} ref={this.setBoundaryRef}>
                    <label htmlFor="username">Username:</label>
                    <div>
                        <Input id="username" name="username" />
                    </div>
                    <label htmlFor="password">Password:</label>
                    <div>
                        <Input id="password" name="password" type="password" />
                    </div>
                    <label htmlFor="password-repeat">Repeat password:</label>
                    <div>
                        <Input id="password-repeat" name="password-repeat" type="password" />
                    </div>
                    <label htmlFor="gender">Gender:</label>
                    <div>
                        <Select id="gender" name="gender">
                            <option value="">{''}</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                        </Select>
                    </div>
                    <label htmlFor="submit">Form controls</label>
                    <TabBoundary boundaryKey="controls">
                        <Input
                            name="reset"
                            // tslint:disable-next-line:jsx-no-multiline-js jsx-no-lambda react-tsx-curly-spacing
                            onClick={this.focusFirst}
                            type="reset"
                            value="Reset"
                        />
                        <Button id="submit" name="submit">
                            Submit
                        </Button>
                    </TabBoundary>
                </TabBoundary>
            </form>
        );
    }
}

ReactDOM.render(React.createElement(App), document.querySelector('#root'));
