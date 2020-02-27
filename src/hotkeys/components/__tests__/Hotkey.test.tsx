import { cleanup, render, fireEvent, act } from '@testing-library/react';
import { Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/components/Hotkey';
import React from 'react';
import { installErrorBoundary } from '@zeroconf/keyboard-navigation/__tests__/helpers/errorBoundary';
import { GlobalHotkeyBoundary } from '@zeroconf/keyboard-navigation/hotkeys/components/GlobalHotkeyBoundary';

afterEach(cleanup);

const createErrorBoundary = installErrorBoundary();

test('render hotkey outside boundary throws', () => {
    const handler = jest.fn();
    const [ErrorBoundary, errorRef] = createErrorBoundary();

    render(
        <ErrorBoundary>
            <Hotkey hotkey="s" handler={handler} />
        </ErrorBoundary>,
    );

    expect(errorRef.current).toMatchInlineSnapshot(`
        Object {
          "error": [Error: It appears that useHotkey/useHotkeys is called outside of a hotkey boundary, consider wrapping your application in a <GlobalHotkeyBoundary />],
          "errorInfo": Object {
            "componentStack": "
            in Hotkey
            in ErrorBoundary",
          },
        }
    `);
});

test('rendering hotkey inside a boundary does not throw', () => {
    const handler = jest.fn();
    expect(() => {
        render(
            <GlobalHotkeyBoundary>
                <Hotkey hotkey="s" handler={handler} />
            </GlobalHotkeyBoundary>,
        );
    }).not.toThrow();
});

test('firing hotkey calls handler', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
        <GlobalHotkeyBoundary>
            <Hotkey hotkey="s" handler={handler} />
            <div tabIndex={-1} data-testid="element-with-focus" />
        </GlobalHotkeyBoundary>,
    );

    const elm = getByTestId('element-with-focus');

    expect(handler).not.toHaveBeenCalled();
    act(() => {
        fireEvent.keyDown(elm, {
            key: 's',
        });
    });
    expect(handler).toHaveBeenCalledTimes(1);
});
