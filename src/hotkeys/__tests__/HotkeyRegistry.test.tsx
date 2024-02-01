/** @jest-environment jsdom */
import { cleanup, render } from '@testing-library/react';
import { GlobalHotkeyBoundary } from '@zeroconf/keyboard-navigation/hotkeys/components/GlobalHotkeyBoundary';
import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { createRef } from 'react';

afterEach(cleanup);

test("disposing global registry, won't result in stale registry provided by default context value", () => {
    const hotkeyRegistryRef = createRef<HotkeyRegistry>();
    const { rerender } = render(<GlobalHotkeyBoundary hotkeyRegistryRef={hotkeyRegistryRef} key="0" />);

    let currentHotkeyRegistry = hotkeyRegistryRef.current;
    expect(currentHotkeyRegistry).toBeInstanceOf(HotkeyRegistry);
    expect(currentHotkeyRegistry).toBe(HotkeyRegistry.global);

    const oldHotkeyRegistry = currentHotkeyRegistry as HotkeyRegistry;
    oldHotkeyRegistry.dispose();

    rerender(<GlobalHotkeyBoundary hotkeyRegistryRef={hotkeyRegistryRef} key="0" />);

    currentHotkeyRegistry = hotkeyRegistryRef.current;
    expect(currentHotkeyRegistry).toBeInstanceOf(HotkeyRegistry);
    expect(currentHotkeyRegistry).toBe(HotkeyRegistry.global);
    expect(currentHotkeyRegistry).not.toBe(oldHotkeyRegistry);
});
