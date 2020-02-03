import { parse, Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type HotkeyContextScope = 'global' | 'local' | string;
export type HotkeyHandler = () => boolean;

class HotkeyRegistry {
    private hotkeyMap: Map<Hotkey, HotkeyHandler>;
    private subscriptions: (() => void)[];
    public readonly scope: HotkeyContextScope;
    public constructor(scope: HotkeyContextScope) {
        this.scope = scope;
        this.hotkeyMap = new Map();
        this.subscriptions = [];
    }

    private triggerSubscriptions() {
        this.subscriptions.forEach(cb => cb());
    }

    public add(hotkey: Hotkey, handler: HotkeyHandler, _scope?: HotkeyContextScope): void {
        if (this.hotkeyMap.has(hotkey)) {
            throw new Error('Hotkey is already defined for this scope.');
        } else {
            this.hotkeyMap.set(hotkey, handler);
            this.triggerSubscriptions();
        }
    }

    public getGlobalHotkeys(): readonly Hotkey[] {
        return [];
    }

    public getHotkeys(): readonly Hotkey[] {
        return Array.from(this.hotkeyMap.keys());
    }

    public remove(hotkey: Hotkey, _handler: HotkeyHandler, _scope?: HotkeyContextScope) {
        if (!this.hotkeyMap.has(hotkey)) {
            throw new Error('Hotkey was not found in this scope.');
        } else {
            this.hotkeyMap.delete(hotkey);
            this.triggerSubscriptions();
        }
    }

    public subscribe(callback: () => void) {
        this.subscriptions.push(callback);
        return () => {
            const idx = this.subscriptions.indexOf(callback);
            if (idx === -1) {
                throw new Error('Could not cancel subscription');
            } else {
                this.subscriptions.splice(idx, 1);
            }
        };
    }
}

const HotkeyContext = React.createContext(new HotkeyRegistry('global'));

export const HotkeyContextProvider = HotkeyContext.Provider;
export const useHotkeyContext = () => {
    const [, setUpdater] = useState(0);
    const updater = useCallback(() => setUpdater(s => s + 1), []);
    const context = useContext(HotkeyContext);
    React.useLayoutEffect(() => context.subscribe(updater), [context]);
    return context;
};

export const useHotkey = (hotkeyStr: string, callback: () => boolean, scope?: HotkeyContextScope) => {
    const context = useHotkeyContext();
    const hotkey = useMemo(() => parse(hotkeyStr), [hotkeyStr]);
    useEffect(() => {
        context.add(hotkey, callback, scope);
        return () => context.remove(hotkey, callback, scope);
    }, [context, hotkey, callback, scope]);
    return hotkey;
};
