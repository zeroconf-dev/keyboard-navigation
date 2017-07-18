import { Button, Input, Select, TabBoundry } from 'index';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component {
    private focusFirst = (e: React.MouseEvent<HTMLInputElement>) => {
        // this is not the real implementation
        // but a quick hack to proof that the concept works.
        const comp = (e as any)._dispatchInstances._currentElement._owner;
        const context = comp._context;
        context.tabRegistry.parentRegistry.focusFirst();
    };

    private preventDefault = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

    public render() {
        return (
            // tslint:disable-next-line:jsx-no-lambda
            <form onSubmit={this.preventDefault}>
                <TabBoundry cycle={true}>
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
                            <option value="">
                                {''}
                            </option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                        </Select>
                    </div>
                    <label htmlFor="submit">Form controls</label>
                    <TabBoundry boundryKey="controls">
                        <Input
                            name="reset"
                            type="reset"
                            value="Reset"
                            // tslint:disable-next-line:jsx-no-multiline-js jsx-no-lambda react-tsx-curly-spacing
                            onClick={this.focusFirst}
                        />
                        <Button id="submit" name="submit">
                            Submit
                        </Button>
                    </TabBoundry>
                </TabBoundry>
            </form>
        );
    }
}

ReactDOM.render(React.createElement(App), document.querySelector('#root'));