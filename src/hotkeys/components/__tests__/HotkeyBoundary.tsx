import { act, cleanup, render } from '@testing-library/react';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/__helpers__/assert';
import { HotkeyObject } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import { GlobalHotkeyBoundary } from '@zeroconf/keyboard-navigation/hotkeys/components/GlobalHotkeyBoundary';
import { HotkeyBoundary } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyBoundary';
import { useHotkey } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkey';
import { scopes, HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import * as React from 'react';
import { createRef, useCallback } from 'react';

afterEach(() => {
    HotkeyRegistry.global.dispose();
    cleanup();
});

function expectHotkeyRegistry(obj: any) {
    return expectInstanceOf(obj, HotkeyRegistry as any) as HotkeyRegistry;
}

test('render unscoped root boundary is providing global hotkey registry', () => {
    const rootRegistryRef = createRef<HotkeyRegistry>();
    render(
        <GlobalHotkeyBoundary hotkeyRegistryRef={rootRegistryRef}>
            <div />
        </GlobalHotkeyBoundary>,
    );

    const rootRegistry = expectHotkeyRegistry(rootRegistryRef.current);
    expect(rootRegistry).toBeInstanceOf(HotkeyRegistry);
    expect(rootRegistry.scope).toBe(scopes.global);
    expect(rootRegistry).toBe(rootRegistry.global);
});

test('unscoped second level boundary is local scope', async () => {
    const rootRegistryRef = createRef<HotkeyRegistry>();
    const localRegistryRef = createRef<HotkeyRegistry>();
    render(
        <GlobalHotkeyBoundary hotkeyRegistryRef={rootRegistryRef}>
            <HotkeyBoundary hotkeyRegistryRef={localRegistryRef} />
        </GlobalHotkeyBoundary>,
    );

    const rootRegistry = expectHotkeyRegistry(rootRegistryRef.current);
    const localRegistry = expectHotkeyRegistry(localRegistryRef.current);
    expect(rootRegistry.scope).toBe(scopes.global);
    expect(localRegistry.scope).toBe(scopes.local);
});

test('scoped first level boundary is child of global', () => {
    const registryRef = createRef<HotkeyRegistry>();
    render(<HotkeyBoundary hotkeyRegistryRef={registryRef} scope="mainmenu" />);

    const registry = expectHotkeyRegistry(registryRef.current);
    expect(registry.scope).toBe('mainmenu');
    expect(registry.parent.scope).toBe(scopes.global);
});

test('changing scope names removes old scope, and creating a new', async () => {
    const rootRegistryRef = createRef<HotkeyRegistry>();
    const { rerender } = render(
        <GlobalHotkeyBoundary hotkeyRegistryRef={rootRegistryRef}>
            <HotkeyBoundary scope="scope1" />
            <HotkeyBoundary scope="scope2" />
            <HotkeyBoundary scope="scope3" />
        </GlobalHotkeyBoundary>,
    );

    const rootRegistry = expectHotkeyRegistry(rootRegistryRef.current);
    expect(rootRegistry.scopes.size).toBe(3);
    expect(Array.from(rootRegistry.scopes.keys()).map(scope => String(scope))).toMatchObject([
        'scope1',
        'scope2',
        'scope3',
    ]);

    act(() => {
        rerender(
            <GlobalHotkeyBoundary hotkeyRegistryRef={rootRegistryRef}>
                <HotkeyBoundary scope="scope1" />
                <HotkeyBoundary scope="scope2" />
                <HotkeyBoundary scope="scope3a" />
            </GlobalHotkeyBoundary>,
        );
    });

    expect(rootRegistry.scopes.size).toBe(3);
    expect(Array.from(rootRegistry.scopes.keys()).map(scope => String(scope))).toMatchObject([
        'scope1',
        'scope2',
        'scope3a',
    ]);
});

interface FocusByKeyProps {
    global?: boolean;
    hotkey: string;
    onHotkey: () => boolean;
}
const HotkeyMonitor: React.FC<FocusByKeyProps> = props => {
    const handler = useCallback(() => {
        return props.onHotkey();
    }, [props.hotkey, props.onHotkey]);
    useHotkey(props.hotkey, handler, props.global);
    return null;
};

test('hotkeys of boundaries with same scope are merged', async () => {
    const mainRegistryRef = createRef<HotkeyRegistry>();
    const handler = jest.fn(() => true);

    act(() => {
        render(
            <React.Fragment>
                <HotkeyBoundary hotkeyRegistryRef={mainRegistryRef} scope="main">
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

    const mainRegistry = expectHotkeyRegistry(mainRegistryRef.current);
    const mainScopeRegistries = expectInstanceOf(mainRegistry.global.scopes.get('main'), Set) as Set<HotkeyRegistry>;
    const hotkeyMap = Array.from(mainScopeRegistries.values()).reduce(
        (c, r) => c.concat(Array.from(r.iterLocalHotkeys())),
        [] as HotkeyObject[],
    );

    expect(hotkeyMap.length).toBe(2);
    expect(Array.from(hotkeyMap.values())).toMatchInlineSnapshot(`
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
    const globalRegistryRef = createRef<HotkeyRegistry>();
    const handler = jest.fn(() => true);

    act(() => {
        render(
            <GlobalHotkeyBoundary hotkeyRegistryRef={globalRegistryRef}>
                <HotkeyMonitor hotkey="esc" onHotkey={handler} />
                <HotkeyBoundary scope="main">
                    <HotkeyBoundary scope="search">
                        <HotkeyMonitor global={true} hotkey="mod+f" onHotkey={handler} />
                    </HotkeyBoundary>
                </HotkeyBoundary>
                <HotkeyBoundary scope="menu">
                    <HotkeyMonitor global={true} hotkey="m" onHotkey={handler} />
                    <HotkeyMonitor hotkey="enter" onHotkey={handler} />
                </HotkeyBoundary>
                <HotkeyBoundary scope="main">
                    <HotkeyMonitor global={true} hotkey="a" onHotkey={handler} />
                </HotkeyBoundary>
            </GlobalHotkeyBoundary>,
        );
    });

    const globalRegistry = expectHotkeyRegistry(globalRegistryRef.current);
    const hotkeyMap = Array.from(globalRegistry.iterLocalHotkeys());

    expect(hotkeyMap.length).toBe(4);
    expect(Array.from(hotkeyMap.values())).toMatchInlineSnapshot(`
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
