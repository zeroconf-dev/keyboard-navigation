/** @jest-environment jsdom */
import { act, cleanup, render } from '@testing-library/react';
import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { TabBoundary } from '@zeroconf/keyboard-navigation/components/TabBoundary';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/helpers/assert';
import { FocuserFn, TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import { installErrorBoundary } from '@zeroconf/keyboard-navigation/__tests__/helpers/errorBoundary';
import { useLayoutEffect } from 'react';
import * as React from 'react';

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

    const createErrorBoundary = installErrorBoundary();

    test('rendering a focusable outside NavigationContext throws', () => {
        const Focusable = () => {
            useFocusable('test', () => true);
            return <div />;
        };

        const [ErrorBoundary, errorRef] = createErrorBoundary();
        render(
            <ErrorBoundary>
                <Focusable />
            </ErrorBoundary>,
        );

        expect(errorRef.current).toMatchInlineSnapshot(`
            {
              "error": [Error: A focusable must be rendered inside NavigationContext],
              "errorInfo": {
                "componentStack": "
                at Focusable
                at ErrorBoundary",
              },
            }
        `);
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
        });
        const tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);

        expect(focus).not.toHaveBeenCalled();
        tabRegistry.focus('test');
        expect(focus).toHaveBeenCalledTimes(1);
        expect(focus).toHaveBeenCalledWith({ focusOrigin: 'none' });
    });

    test('Focusable Next/Prev relationship', () => {
        const focus = jest.fn();
        const Focusable = React.forwardRef((p: { focusKey: string }, ref: React.Ref<HTMLDivElement>) => {
            const props = useFocusable(p.focusKey, focus);
            return <div {...props} ref={ref} />;
        });
        Focusable.displayName = 'Focusable';

        const tabRegistryRef = React.createRef<TabRegistry>();
        const field2Ref = React.createRef<HTMLDivElement>();
        act(() => {
            render(
                <TabBoundary tabRegistryRef={tabRegistryRef}>
                    <Focusable focusKey="field1" />
                    <Focusable focusKey="field2" ref={field2Ref} />
                </TabBoundary>,
            );
        });

        const tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);
        tabRegistry.focusNext('field1');
        expect(field2Ref.current).toBeInstanceOf(HTMLDivElement);
    });
});
