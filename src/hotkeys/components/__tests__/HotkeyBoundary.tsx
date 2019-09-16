import { act, cleanup, render } from '@testing-library/react';
import {
    scopes,
    HotkeyBoundary,
    HotkeyRegistry,
} from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyBoundary';
import * as React from 'react';
import { createRef } from 'react';

afterEach(cleanup);

test.skip('render unscoped root boundary is provided with global hotkey registry', () => {
    const rootRegistryRef = createRef<HotkeyRegistry>();
    act(() => {
        render(
            <HotkeyBoundary registryRef={rootRegistryRef}>
                <div />
            </HotkeyBoundary>,
        );
    });
    expect(rootRegistryRef.current).toBeInstanceOf(HotkeyRegistry);
    expect(rootRegistryRef.current!.scope).toBe(scopes.global);
});

test.skip('unscoped second level boundary is local scope', () => {
    const rootRegistryRef = createRef<HotkeyRegistry>();
    const localRegistryRef = createRef<HotkeyRegistry>();
    act(() => {
        render(
            <HotkeyBoundary registryRef={rootRegistryRef}>
                <HotkeyBoundary registryRef={localRegistryRef} />
            </HotkeyBoundary>,
        );
    });
    expect(rootRegistryRef.current).toBeInstanceOf(HotkeyRegistry);
    expect(localRegistryRef.current).toBeInstanceOf(HotkeyRegistry);
    expect(rootRegistryRef.current!.scope).toBe(scopes.global);
    expect(localRegistryRef.current!.scope).toBeInstanceOf(scopes.local);
});
