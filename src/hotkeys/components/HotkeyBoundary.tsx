import * as React from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

const globalScope: unique symbol = Symbol('global');
const localScope: unique symbol = Symbol('local');

export const scopes = {
    global: globalScope,
    local: localScope,
};

type HotkeyContextScope = typeof globalScope | typeof localScope | string;

export class HotkeyRegistry {
    public get parent() {
        return this.parentRegistry || globalRegistry;
    }

    public get root() {
        return globalRegistry;
    }

    private parentRegistry: HotkeyRegistry | null = null;
    public children: Set<HotkeyRegistry>;
    public readonly scope: HotkeyContextScope;

    public constructor(scope: HotkeyContextScope) {
        this.children = new Set();
        this.scope = scope;
    }

    public addChild(childRegistry: HotkeyRegistry) {
        this.children.add(childRegistry);
        childRegistry.setParent(this);
    }

    public removeChild(childRegistry: HotkeyRegistry) {
        this.children.delete(childRegistry);
        if (childRegistry.parent === this) {
            childRegistry.setParent(null);
        }
    }

    public setParent(parentRegistry: HotkeyRegistry | null) {
        this.parentRegistry = parentRegistry;
    }
}

const globalRegistry = new HotkeyRegistry(globalScope);
const HotkeyContext = createContext(globalRegistry);
export const HotkeyContextProvider = HotkeyContext.Provider;
export const useHotkeyContext = () => useContext(HotkeyContext);

interface HotkeyBoundaryProps {
    preventBubbling?: boolean;
    registryRef?: React.RefObject<HotkeyRegistry>;
    scope?: Exclude<HotkeyContextScope, typeof globalScope>;
}

export const HotkeyBoundary: React.FC<HotkeyBoundaryProps> = props => {
    const scope = props.scope || localScope;
    const parentContext = useHotkeyContext();
    const context = useMemo(() => new HotkeyRegistry(scope), [scope]);
    if (props.registryRef != null && props.registryRef.current !== context) {
        (props.registryRef as React.MutableRefObject<HotkeyRegistry>).current = context;
    }
    useEffect(() => {
        context.setParent(parentContext);
    }, [parentContext, context]);

    return <HotkeyContextProvider children={props.children} value={context} />;
};
