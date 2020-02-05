import { act, cleanup, render } from '@testing-library/react';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/__helpers__/assert';
import {
    HotkeyBoundary,
} from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyBoundary';
import {
    GlobalHotkeyBoundary,
} from '@zeroconf/keyboard-navigation/hotkeys/components/GlobalHotkeyBoundary';
import {
    HotkeyRegistry,
    scopes,
} from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { useHotkey } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkey';
import * as React from 'react';
import { createRef, useCallback } from 'react';
import { Hotkey } from '@zeroconf/keyboard-navigation/hooks';

beforeEach(() => {
    HotkeyRegistry.global.dispose();
});

afterEach(() => {
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

    const rootRegistry = expectHotkeyRegistry(rootRegistryRef.current)
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

    const rootRegistry = expectHotkeyRegistry(rootRegistryRef.current)
    const localRegistry = expectHotkeyRegistry(localRegistryRef.current)
    expect(rootRegistry.scope).toBe(scopes.global);
    expect(localRegistry.scope).toBe(scopes.local);
});

test('scoped first level boundary is child of global', () => {
    const registryRef = createRef<HotkeyRegistry>();
    render(<HotkeyBoundary hotkeyRegistryRef={registryRef} scope="mainmenu" />);

    const registry = expectHotkeyRegistry(registryRef.current)
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

    const rootRegistry = expectHotkeyRegistry(rootRegistryRef.current)
    expect(rootRegistry.scopes.size).toBe(3 + 1);
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

    expect(rootRegistry.scopes.size).toBe(3 + 1);
    expect(Array.from(rootRegistry.scopes.keys()).map(scope => String(scope))).toMatchObject([
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

test.skip('hotkeys of boundaries with same scope are merged', async () => {
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

    const mainRegistry = expectHotkeyRegistry(mainRegistryRef.current)
    const hotkeyMap = Array.from(mainRegistry.global.scopes.get('main')!.values()).reduce((c, r) => c.concat(Array.from(r.iterLocalHotkeys())), [] as Hotkey[]);

    expect(hotkeyMap.length).toBe(2);
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

test.skip('global keys at multiple levels are merged', async () => {
    const mainRegistryRef = createRef<HotkeyRegistry>();
    const handler = jest.fn(() => true);

    act(() => {
        render(
            <GlobalHotkeyBoundary hotkeyRegistryRef={mainRegistryRef}>
                <HotkeyMonitor hotkey="esc" onHotkey={handler} />
                <HotkeyBoundary scope="main">
                    <HotkeyBoundary scope="search">
                        <HotkeyBoundary scope="global">
                            <HotkeyMonitor hotkey="mod+f" onHotkey={handler} />
                        </HotkeyBoundary>
                    </HotkeyBoundary>
                </HotkeyBoundary>
                <HotkeyBoundary scope="menu">
                    <HotkeyBoundary scope="global">
                        <HotkeyMonitor hotkey="m" onHotkey={handler} />
                    </HotkeyBoundary>
                    <HotkeyMonitor hotkey="enter" onHotkey={handler} />
                </HotkeyBoundary>
                <HotkeyBoundary scope="main">
                    <HotkeyBoundary scope="global">
                        <HotkeyMonitor hotkey="a" onHotkey={handler} />
                    </HotkeyBoundary>
                </HotkeyBoundary>
            </GlobalHotkeyBoundary>,
        );
    });

    const mainRegistry = expectHotkeyRegistry(mainRegistryRef.current)
    const hotkeyMap = Array.from(mainRegistry.global.iterLocalHotkeys());

    expect(hotkeyMap.length).toBe(4);
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
