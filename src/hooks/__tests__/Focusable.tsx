import { act, cleanup, render } from '@testing-library/react';
import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { TabBoundary } from '@zeroconf/keyboard-navigation/components/TabBoundary';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/__helpers__/assert';
import { FocuserFn, TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import { useLayoutEffect } from 'react';
import * as React from 'react';

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
        return;
    });
});

afterAll(() => {
    // tslint:disable-next-line:no-console
    (console.error as any).mockRestore();
});

const useTabRegistry = () => {
    const context = React.useContext(NavigationContext);
    if (context == null) {
        throw new Error('A focusable must be rendered inside NavigationContext');
    }
    return context;
};

const useFocusable = (focusKey: string, focus: TabRegistry | FocuserFn) => {
    const tabRegistry = useTabRegistry();
    useLayoutEffect(() => {
        if (focusKey != null) {
            tabRegistry.add(focusKey, focus);
            return () => tabRegistry.delete(focusKey);
        }
        return;
    }, [tabRegistry, focusKey, focus]);

    return {
        tabIndex: -1,
    };
};

interface ErrorBoundaryProps {
    errorRef: React.RefObject<Error>;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
    public static getDerivedStateFromError = (error: any) => ({
        hasError: error != null,
    });

    public constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    private tryAgain = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ hasError: false });
    };

    public componentDidCatch(error: any) {
        (this.props.errorRef as any).current = error;
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div>
                    <div role="alert">There was a problem.</div> <button onClick={this.tryAgain}>Try again?</button>
                </div>
            );
        } else {
            return this.props.children;
        }
    }
}

describe('Focusable', () => {
    afterEach(cleanup);
    // test('1', () => {
    //     const Focusable = () => {
    //         const [state, setState] = useState(false);
    //         const toggle = useCallback(() => setState(s => s!), []);
    //         return <div onClick={toggle} role="application">{state ? 'on' : 'off'}</div>;
    //     };

    //     const { getByRole } = render(<Focusable />);
    //     const app = getByRole('application');
    //     expect(app).toBeInstanceOf(HTMLDivElement);
    // });

    test('rendering a focusable outside NavigationContext throws', () => {
        const Focusable = () => {
            useFocusable('test', () => true);
            return <div />;
        };

        act(() => {
            const errorRef = React.createRef<Error>();
            render(
                <ErrorBoundary errorRef={errorRef}>
                    <Focusable />
                </ErrorBoundary>,
            );

            expect(errorRef.current).toBeDefined();
            expect(errorRef.current!.message).toBe('A focusable must be rendered inside NavigationContext');
        });
    });

    test(`Rending a focusable inside context doesn't throw`, () => {
        const Focusable = () => {
            const props = useFocusable('test', () => true);
            return <div {...props} />;
        };

        const tabRegistry = new TabRegistry();
        act(() => {
            render(
                <NavigationContext.Provider value={tabRegistry}>
                    <Focusable />
                </NavigationContext.Provider>,
            );
        });
    });

    test('Focus on registry propagates to focusable focus function', () => {
        const focus = jest.fn();
        const Focusable = () => {
            const props = useFocusable('test', focus);
            return <div {...props} />;
        };

        const tabRegistryRef = React.createRef<TabRegistry>();
        act(() => {
            render(
                <TabBoundary tabRegistryRef={tabRegistryRef}>
                    <Focusable />
                </TabBoundary>,
            );
            const tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);

            expect(focus).not.toHaveBeenCalled();
            tabRegistry.focus('test');
            expect(focus).toHaveBeenCalledTimes(1);
            expect(focus).toHaveBeenCalledWith({ focusOrigin: 'none' });
        });
    });

    test('Focusable Next/Prev relationship', () => {
        const focus = jest.fn();
        const Focusable = React.forwardRef((p: { focusKey: string }, ref: React.Ref<HTMLDivElement>) => {
            const props = useFocusable(p.focusKey, focus);
            return <div {...props} ref={ref} />;
        });

        const tabRegistryRef = React.createRef<TabRegistry>();
        const field2Ref = React.createRef<HTMLDivElement>();
        act(() => {
            render(
                <TabBoundary tabRegistryRef={tabRegistryRef}>
                    <Focusable focusKey="field1" />
                    <Focusable focusKey="field2" ref={field2Ref} />
                </TabBoundary>,
            );
            const tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);

            tabRegistry.focusNext('field1');
            expect(field2Ref.current).toBeInstanceOf(HTMLDivElement);
        });
    });
});
