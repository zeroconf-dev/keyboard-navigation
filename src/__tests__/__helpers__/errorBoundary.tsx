import * as React from 'react';

type ErrorBoundary = React.ComponentClass;
export interface ErrorRefObject {
    error: unknown;
    errorInfo: unknown;
}

const createErrorRef = (): React.RefObject<ErrorRefObject> => React.createRef();
const createErrorBoundary = (): [ErrorBoundary, React.RefObject<ErrorRefObject>] => {
    const ref = createErrorRef();
    return [
        class extends React.Component {
            public static displayName = 'ErrorBoundary';
            public componentDidCatch(error: unknown, errorInfo: unknown) {
                (ref as React.MutableRefObject<{ error: unknown; errorInfo: unknown }>).current = {
                    error: error,
                    errorInfo: errorInfo,
                };
            }
            public render() {
                return <>{this.props.children}</>;
            }
        },
        ref,
    ];
};

export const installErrorBoundary = () => {
    beforeEach(() => {
        jest.spyOn(console, 'error');
        // tslint:disable-next-line: no-console
        (console.error as any).mockImplementation(() => {
            return;
        });
    });

    afterEach(() => {
        // tslint:disable-next-line: no-console
        (console.error as any).mockRestore();
    });

    return createErrorBoundary;
};
