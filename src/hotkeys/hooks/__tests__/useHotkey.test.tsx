import { render } from '@testing-library/react';
import { useHotkey } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkey';
import { installErrorBoundary } from '@zeroconf/keyboard-navigation/__tests__/helpers/errorBoundary';
import * as React from 'react';

const createErrorBoundary = installErrorBoundary();

interface HotkeyProps {
    handler: () => boolean;
    hotkey: string;
    isGlobal?: boolean;
}
const Hotkey = (props: HotkeyProps) => {
    useHotkey(props.hotkey, props.handler, props.isGlobal);
    return null;
};

test('registering a hotkey without a boundary throws', () => {
    const handler = jest.fn();
    const [ErrorBoundary, errorRef] = createErrorBoundary();

    render(
        <ErrorBoundary>
            <Hotkey handler={handler} hotkey="1" isGlobal={false} />
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
