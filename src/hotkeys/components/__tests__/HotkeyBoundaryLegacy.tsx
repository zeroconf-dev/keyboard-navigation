import { act, cleanup, render } from '@testing-library/react';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/__helpers__/assert';
import {
    scopes,
    useHotkey,
    HotkeyBoundary,
    HotkeyRegistry,
} from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyBoundaryLegacy';
import * as React from 'react';
import { createRef, useCallback } from 'react';

afterEach(cleanup);

test('render unscoped root boundary is providing global hotkey registry', () => {
    const rootRegistryRef = createRef<HotkeyRegistry>();
    render(
        <HotkeyBoundary registryRef={rootRegistryRef}>
            <div />
        </HotkeyBoundary>,
    );

    const rootRegistry = expectInstanceOf(rootRegistryRef.current, HotkeyRegistry);
    expect(rootRegistry).toBeInstanceOf(HotkeyRegistry);
    expect(rootRegistry.scope).toBe(scopes.global);
});

test('unscoped second level boundary is local scope', async () => {
    const rootRegistryRef = createRef<HotkeyRegistry>();
    const localRegistryRef = createRef<HotkeyRegistry>();
    render(
        <HotkeyBoundary registryRef={rootRegistryRef}>
            <HotkeyBoundary registryRef={localRegistryRef} />
        </HotkeyBoundary>,
    );

    const rootRegistry = expectInstanceOf(rootRegistryRef.current, HotkeyRegistry);
    const localRegistry = expectInstanceOf(localRegistryRef.current, HotkeyRegistry);
    expect(rootRegistry.scope).toBe(scopes.global);
    expect(localRegistry.scope).toBe(scopes.local);
});

test('scoped first level boundary is child of global', () => {
    const registryRef = createRef<HotkeyRegistry>();
    render(<HotkeyBoundary registryRef={registryRef} scope="mainmenu" />);

    const registry = expectInstanceOf(registryRef.current, HotkeyRegistry);
    expect(registry.scope).toBe('mainmenu');
    expect(registry.parent.scope).toBe(scopes.global);
});

test('changing scope names removes old scope, and creating a new', async () => {
    const rootRegistryRef = createRef<HotkeyRegistry>();
    const { rerender } = render(
        <HotkeyBoundary registryRef={rootRegistryRef}>
            <HotkeyBoundary scope="scope1" />
            <HotkeyBoundary scope="scope2" />
            <HotkeyBoundary scope="scope3" />
        </HotkeyBoundary>,
    );

    const rootRegistry = expectInstanceOf(rootRegistryRef.current, HotkeyRegistry);
    expect(rootRegistry.children.size).toBe(3);
    expect(Array.from(rootRegistry.children.values()).map(ch => String(ch.scope))).toMatchObject([
        'scope1',
        'scope2',
        'scope3',
    ]);

    act(() => {
        rerender(
            <HotkeyBoundary registryRef={rootRegistryRef}>
                <HotkeyBoundary scope="scope1" />
                <HotkeyBoundary scope="scope2" />
                <HotkeyBoundary scope="scope3a" />
            </HotkeyBoundary>,
        );
    });

    expect(rootRegistry.children.size).toBe(3);
    expect(Array.from(rootRegistry.children.values()).map(ch => String(ch.scope))).toMatchObject([
        'scope1',
        'scope2',
        'scope3a',
    ]);
});

interface FocusByKeyProps {
    hotkey: string;
    onHotkey: () => boolean;
}
const HotkeyMonitor: React.FC<FocusByKeyProps> = props => {
    const handler = useCallback(() => {
        return props.onHotkey();
    }, [props.hotkey, props.onHotkey]);
    useHotkey(props.hotkey, handler);
    return null;
};

test('hotkeys of boundaries with same scope are merged', async () => {
    const mainRegistryRef = createRef<HotkeyRegistry>();
    const handler = jest.fn(() => true);

    act(() => {
        render(
            <React.Fragment>
                <HotkeyBoundary registryRef={mainRegistryRef} scope="main">
                    <HotkeyMonitor hotkey="right" onHotkey={handler} />
                </HotkeyBoundary>
                <HotkeyBoundary scope="menu">
                    <HotkeyMonitor hotkey="enter" onHotkey={handler} />
                </HotkeyBoundary>
                <HotkeyBoundary scope="main">
                    <HotkeyMonitor hotkey="left" onHotkey={handler} />
                </HotkeyBoundary>
            </React.Fragment>,
        );
    });

    const mainRegistry = expectInstanceOf(mainRegistryRef.current, HotkeyRegistry);
    const hotkeyMap = mainRegistry.getHotkeys('main');

    expect(hotkeyMap.size).toBe(2);
    expect(Array.from(hotkeyMap.keys())).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "ArrowRight",
          },
          Object {
            "key": "ArrowLeft",
          },
        ]
    `);
});

test('global keys at multiple levels are merged', async () => {
    const mainRegistryRef = createRef<HotkeyRegistry>();
    const handler = jest.fn(() => true);

    act(() => {
        render(
            <HotkeyBoundary registryRef={mainRegistryRef}>
                <HotkeyMonitor hotkey="esc" onHotkey={handler} />
                <HotkeyBoundary scope="main">
                    <HotkeyBoundary scope="search">
                        <HotkeyBoundary scope={scopes.global}>
                            <HotkeyMonitor hotkey="mod+f" onHotkey={handler} />
                        </HotkeyBoundary>
                    </HotkeyBoundary>
                </HotkeyBoundary>
                <HotkeyBoundary scope="menu">
                    <HotkeyBoundary scope={scopes.global}>
                        <HotkeyMonitor hotkey="m" onHotkey={handler} />
                    </HotkeyBoundary>
                    <HotkeyMonitor hotkey="enter" onHotkey={handler} />
                </HotkeyBoundary>
                <HotkeyBoundary scope="main">
                    <HotkeyBoundary scope={scopes.global}>
                        <HotkeyMonitor hotkey="a" onHotkey={handler} />
                    </HotkeyBoundary>
                </HotkeyBoundary>
            </HotkeyBoundary>,
        );
    });

    const mainRegistry = expectInstanceOf(mainRegistryRef.current, HotkeyRegistry);
    const hotkeyMap = mainRegistry.getHotkeys(scopes.global);

    expect(hotkeyMap.size).toBe(4);
    expect(Array.from(hotkeyMap.keys())).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "Escape",
          },
          Object {
            "key": "f",
            "mod": true,
          },
          Object {
            "key": "m",
          },
          Object {
            "key": "a",
          },
        ]
    `);
});
