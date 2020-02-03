import { parse, Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import * as React from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

const globalScope: unique symbol = Symbol('global');
const localScope: unique symbol = Symbol('local');

export const scopes = {
    global: globalScope,
    local: localScope,
} as Readonly<{
    global: typeof globalScope;
    local: typeof localScope;
}>;

type HotkeyContextScope = typeof globalScope | typeof localScope | string;
type HotkeyHandler = () => boolean;

interface RootHotkeyRegistry {
    getHotkeys(scope: HotkeyContextScope): Map<Hotkey, HotkeyHandler>;
}

export class HotkeyRegistry {
    public get parent() {
        return this.parentRegistry || globalRegistry;
    }

    public get root() {
        return globalRegistry as HotkeyRegistry & RootHotkeyRegistry;
    }

    private _hotkeyMap: Map<Hotkey, HotkeyHandler>;
    public get hotkeyMap() {
        return this._hotkeyMap as ReadonlyMap<Hotkey, HotkeyHandler>;
    }
    private parentRegistry: HotkeyRegistry | null = null;
    private scopesMap: Map<HotkeyContextScope, Set<HotkeyRegistry>>;

    public children: Set<HotkeyRegistry>;
    public readonly scope: HotkeyContextScope;

    public constructor(scope: HotkeyContextScope) {
        this.children = new Set();
        this.scope = scope;
        this._hotkeyMap = new Map();
        this.scopesMap = new Map<HotkeyContextScope, Set<HotkeyRegistry>>([[globalScope, new Set([this])]]);
    }

    private registerHotkeyRegistry(scope: HotkeyContextScope, registry: HotkeyRegistry): void {
        const scopeRegistries = this.scopesMap.get(scope) || new Set();
        scopeRegistries.add(registry);
        this.scopesMap.set(scope, scopeRegistries);
    }

    private unregisterHotkeyRegistry(scope: HotkeyContextScope, registry: HotkeyRegistry): void {
        const scopeRegistries = this.scopesMap.get(scope);
        if (scopeRegistries != null) {
            scopeRegistries.delete(registry);
        }
    }

    public addHotkey(hotkey: Hotkey, handler: HotkeyHandler) {
        if (this._hotkeyMap.has(hotkey)) {
            throw new Error('Hotkey is already defined for this scope.');
        } else {
            this._hotkeyMap.set(hotkey, handler);
            // this.triggerSubscriptions();
        }
    }

    public addRegistry(childRegistry: HotkeyRegistry) {
        this.children.add(childRegistry);
        childRegistry.setParentRegistry(this);
        if (childRegistry.scope !== scopes.local) {
            this.root.registerHotkeyRegistry(childRegistry.scope, childRegistry);
        }
    }

    public getHotkeys(scope?: HotkeyContextScope): ReadonlyMap<Hotkey, HotkeyHandler> {
        if (scope == null) {
            return this.hotkeyMap;
        } else {
            const result = new Map();
            const registries = this.root.scopesMap.get(scope);
            if (registries != null) {
                registries.forEach(
                    registry =>
                        registry.scope === scope &&
                        registry.hotkeyMap.forEach((handler, hotkey) => {
                            result.set(hotkey, handler);
                        }),
                );
            }
            return result;
        }
    }

    public removeHotkey(hotkey: Hotkey) {
        if (!this._hotkeyMap.has(hotkey)) {
            throw new Error('Hotkey was not found in this scope.');
        } else {
            this._hotkeyMap.delete(hotkey);
            // this.triggerSubscriptions();
        }
    }

    public removeRegistry(childRegistry: HotkeyRegistry) {
        if (childRegistry.scope !== scopes.local) {
            this.root.unregisterHotkeyRegistry(childRegistry.scope, childRegistry);
        }
        if (childRegistry.parent === this) {
            childRegistry.setParentRegistry(null);
        }
        this.children.delete(childRegistry);
    }

    public setParentRegistry(parentRegistry: HotkeyRegistry | null) {
        this.parentRegistry = parentRegistry;
    }
}

const globalRegistry = new HotkeyRegistry(globalScope);
const HotkeyContext = createContext<HotkeyRegistry | null>(null);
export const HotkeyContextProvider = HotkeyContext.Provider;
export const useHotkeyContext = () => useContext(HotkeyContext);

export const useHotkey = (hotkeyStr: string, callback: () => boolean) => {
    const context = useHotkeyContext();
    if (context == null) {
        throw new Error('use hotkey need to be used inside a HotkeyContext');
    }
    const hotkey = useMemo(() => parse(hotkeyStr), [hotkeyStr]);
    useEffect(() => {
        context.addHotkey(hotkey, callback);
        return () => context.removeHotkey(hotkey);
    }, [context, hotkey, callback]);
    return hotkey;
};

interface HotkeyBoundaryProps {
    preventBubbling?: boolean;
    registryRef?: React.RefObject<HotkeyRegistry>;
    scope?: HotkeyContextScope;
}

export const HotkeyBoundary: React.FC<HotkeyBoundaryProps> = props => {
    const parentContext = useHotkeyContext();
    const scope = props.scope == null ? (parentContext == null ? globalScope : localScope) : props.scope;
    const context = useMemo(
        () => (parentContext == null && scope === globalScope ? globalRegistry : new HotkeyRegistry(scope)),
        [scope, parentContext],
    );

    if (props.registryRef != null && props.registryRef.current !== context) {
        (props.registryRef as React.MutableRefObject<HotkeyRegistry>).current = context;
    }

    useEffect(() => {
        if (parentContext == null) {
            if (context.scope !== scopes.global) {
                globalRegistry.addRegistry(context);
                return () => globalRegistry.removeRegistry(context);
            }
        } else {
            parentContext.addRegistry(context);
            return () => parentContext.removeRegistry(context);
        }
        return;
    }, [context, parentContext]);

    return <HotkeyContextProvider children={props.children} value={context} />;
};
