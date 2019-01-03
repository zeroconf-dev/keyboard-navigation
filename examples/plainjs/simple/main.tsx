import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Input, Select, TabBoundary, TabRegistry } from '../../../src/index';

interface Props {}

class App extends React.Component<Props> {
    private tabRegistryRef: React.RefObject<TabRegistry>;

    public constructor(props: Props) {
        super(props);
        this.tabRegistryRef = React.createRef<TabRegistry>();
    }

    private focusFirst = (e: React.MouseEvent<HTMLInputElement>) => {
        // this is not the real implementation
        // but a quick hack to proof that the concept works.
        if (this.tabRegistryRef.current != null) {
            this.tabRegistryRef.current.focusFirst();
        }
    };

    private preventDefault = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

    public render() {
        return (
            // tslint:disable-next-line:jsx-no-lambda
            <form onSubmit={this.preventDefault}>
                <TabBoundary cycle={true} tabRegistryRef={this.tabRegistryRef}>
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

ReactDOM.render(React.createElement(App) as any, document.querySelector('#root'));
