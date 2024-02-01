import React from 'react';

type ErrorBoundary = React.ComponentClass;
export interface ErrorRefObject {
    error: Error;
    errorInfo: {
        componentStack: string;
    };
}

const componentStackLineRegex = /^([\s\w\d]+)( \(\/.*\))?$/;

const createErrorRef = (): React.RefObject<ErrorRefObject> => React.createRef();
const createErrorBoundary = (): [ErrorBoundary, React.RefObject<ErrorRefObject>] => {
    const ref = createErrorRef();
    return [
        class ErrorBoundary extends React.Component<{ readonly children?: React.ReactNode }> {
            public static displayName = 'ErrorBoundary';
            public componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
                (ref as React.MutableRefObject<{ error: Error; errorInfo: { componentStack: string } }>).current = {
                    error: error,
                    errorInfo: {
                        ...errorInfo,
                        componentStack: errorInfo.componentStack.split('\n').map(line =>
                            line.trim().startsWith('at /')
                                ? null
                                : line.replace(componentStackLineRegex, '$1')
                        ).filter(line => line != null).join('\n'),
                    },
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
