import { isHotkeyMatching, EventBubbleControl, HotkeyEvent } from '@zeroconf/keyboard-navigation/hotkeys/createHandler';
import { parse, Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/parser';

let globalRegistry: HotkeyRegistry | null = null;
let currentLocalRegistry: HotkeyRegistry | null = null;
const subscriptions: Set<(registry: HotkeyRegistry | null) => void> = new Set();

const localScope: unique symbol = Symbol('local');
const globalScope: unique symbol = Symbol('global');

export const scopes = Object.freeze({
    global: globalScope,
    local: localScope,
});

export type HotkeyPublicScope = typeof localScope | string;
export type HotkeyScope = HotkeyPublicScope | typeof globalScope;

export type HotkeyHandler = (e: HotkeyEvent & Partial<EventBubbleControl>) => boolean;
type HotkeyTuppleWithID = [HotkeyID, string, Hotkey, HotkeyHandler];
export type HotkeyMap = {
    [hotkey: string]: HotkeyHandler | null | undefined | false;
};

interface HotkeyRegistryOptions {
    crossGlobalBoundary?: boolean;
    crossLocalBoundary?: boolean;
}

const defaultOptions: HotkeyRegistryOptions = {
    crossGlobalBoundary: true,
    crossLocalBoundary: false,
};

enum HotkeyIDBrand {}
export type HotkeyID = HotkeyIDBrand & number;
let _hotkeyId = 0 as HotkeyID;
const nextHotkeyId = () => _hotkeyId++;

export class HotkeyRegistry {
    public get currentLocalRegistry() {
        return currentLocalRegistry;
    }

    public set currentLocalRegistry(registry: HotkeyRegistry | null) {
        currentLocalRegistry = registry;
        subscriptions.forEach(handler => handler(registry));
    }
    public static get global() {
        if (globalRegistry == null) {
            globalRegistry = new HotkeyRegistry(globalScope, null, {
                crossGlobalBoundary: false,
                crossLocalBoundary: false,
            });
        }
        return globalRegistry;
    }

    public get global() {
        return HotkeyRegistry.global;
    }

    // tslint:disable-next-line: no-reserved-keywords
    public static for(parent: HotkeyRegistry, options?: HotkeyRegistryOptions): HotkeyRegistry;
    // tslint:disable-next-line: no-reserved-keywords
    public static for(
        parent: HotkeyRegistry,
        scope?: HotkeyPublicScope,
        options?: HotkeyRegistryOptions,
    ): HotkeyRegistry;
    // tslint:disable-next-line: no-reserved-keywords
    public static for(
        parent: HotkeyRegistry,
        scope: HotkeyPublicScope | HotkeyRegistryOptions = defaultOptions,
        options: HotkeyRegistryOptions = defaultOptions,
    ) {
        const newScope = typeof scope === 'object' ? (scopes.local as typeof localScope) : scope;
        const newOptions = typeof scope === 'object' ? scope : options;

        return new HotkeyRegistry(newScope, parent, newOptions);
    }

    private disposed = false;
    private readonly hotkeys: Map<HotkeyID, HotkeyTuppleWithID> = new Map();

    public readonly crossGlobalBoundary: boolean;
    public readonly crossLocalBoundary: boolean;
    public readonly parent: HotkeyRegistry;
    public readonly scope: HotkeyScope;
    public readonly scopes: Map<string, Set<HotkeyRegistry>> = new Map();

    private constructor(
        scope: HotkeyScope,
        parent: HotkeyRegistry | null,
        options: HotkeyRegistryOptions = defaultOptions,
    ) {
        if (scope === globalScope && globalRegistry != null) {
            throw new Error('Cannot instantiate more than one global registry.');
        }

        if (scope === globalScope) {
            this.parent = this;
        } else if (parent == null) {
            throw new TypeError('parent scope cannot be null');
        } else {
            this.parent = parent;
        }
        this.crossGlobalBoundary = options.crossGlobalBoundary == null ? true : options.crossGlobalBoundary;
        this.crossLocalBoundary = options.crossLocalBoundary == null ? true : options.crossLocalBoundary;
        this.scope = scope;

        if (typeof scope === 'string') {
            const registries = this.global.scopes.get(scope) || new Set();
            registries.add(this);
            this.global.scopes.set(scope, registries);
        }
    }

    private getCrossGlobalBoundary() {
        let reg: HotkeyRegistry = this;
        while (true) {
            if ((this.scope !== scopes.global && reg === this.global) || reg == null) {
                return true;
            }
            if (!reg.crossGlobalBoundary) {
                return false;
            }
            reg = reg.parent;
        }
    }

    private iterLocal = function*(this: HotkeyRegistry): Generator<HotkeyRegistry, void, void> {
        let reg = this;
        while (true) {
            if ((this.scope !== scopes.global && reg === this.global) || reg == null) {
                return; // never yield global from iterLocal
            }
            yield reg;
            if (!reg.crossLocalBoundary) {
                return;
            }
            reg = reg.parent;
        }
    };

    private iterScope = function*(this: HotkeyRegistry, scope: string): Generator<HotkeyRegistry, void, undefined> {
        const registries = this.global.scopes.get(scope);
        if (registries != null) {
            for (const registry of registries) {
                if (this.scope !== scope || registry !== this) {
                    yield registry;
                }
            }
        }

        if (this.scope === scope) {
            yield* this;
        }

        return;
    };

    private runGlobal(e: HotkeyEvent & Partial<EventBubbleControl>): boolean {
        return this.global.run(e);
    }

    private runLocal(e: HotkeyEvent & Partial<EventBubbleControl>): boolean {
        for (const registry of this) {
            if (registry.run(e)) {
                return true;
            }
        }
        return false;
    }

    private runScope(e: HotkeyEvent & Partial<EventBubbleControl>, scope: string): boolean {
        for (const registry of this.iterScope(scope)) {
            if (registry.run(e)) {
                return true;
            }
        }
        return false;
    }

    public [Symbol.iterator] = function*(this: HotkeyRegistry): Generator<HotkeyRegistry, void, void> {
        yield* this.iterLocal();
        if (this.getCrossGlobalBoundary()) {
            yield this.global;
        }
        return;
    };

    public add(hotkeyStr: string, hotkey: Hotkey, handler: HotkeyHandler): HotkeyID {
        const hotkeyId = nextHotkeyId();
        this.hotkeys.set(hotkeyId, [hotkeyId, hotkeyStr, hotkey, handler]);
        return hotkeyId;
    }

    public addAll(hotkeyMap: HotkeyMap): HotkeyID[] {
        return Object.keys(hotkeyMap).reduce((carry, hotkeyStr) => {
            const handler = hotkeyMap[hotkeyStr];
            if (handler != null && handler !== false) {
                carry.push(this.add(hotkeyStr, parse(hotkeyStr), handler));
            }
            return carry;
        }, [] as HotkeyID[]);
    }

    public dispose() {
        if (this.disposed) {
            return;
        }
        this.disposed = true;

        if (typeof this.scope === 'string') {
            const registries = this.global.scopes.get(this.scope);
            if (registries != null) {
                registries.delete(this);

                if (registries.size === 0) {
                    this.global.scopes.delete(this.scope);
                }
            }
        }
        if (this.scope === globalScope) {
            globalRegistry = null;
        }
    }

    public iterHotkeys = function*(this: HotkeyRegistry): Generator<Hotkey, void, void> {
        for (const reg of this) {
            for (const hotkey of reg.hotkeys.values()) {
                yield hotkey[2];
            }
        }
    };

    public iterLocalHotkeys = function*(this: HotkeyRegistry): Generator<Hotkey, void, void> {
        for (const reg of this.iterLocal()) {
            for (const hotkey of reg.hotkeys.values()) {
                yield hotkey[2];
            }
        }
        return;
    };

    public remove(hotkeyId: HotkeyID) {
        this.hotkeys.delete(hotkeyId);
    }

    public removeAll(hotkeyIds: HotkeyID[]) {
        hotkeyIds.forEach(hotkeyId => this.remove(hotkeyId));
    }

    public run(e: HotkeyEvent & Partial<EventBubbleControl>): boolean {
        for (const hotkey of this.hotkeys.values()) {
            if (isHotkeyMatching(hotkey[2], e)) {
                if (hotkey[3](e)) {
                    if (typeof e.preventDefault === 'function') {
                        e.preventDefault();
                    }
                    if (typeof e.stopPropagation === 'function') {
                        e.stopPropagation();
                    }
                    return true;
                }
            }
        }
        return false;
    }

    public runCurrent(e: HotkeyEvent & Partial<EventBubbleControl>): boolean {
        return this.runFor(e, this.scope);
    }

    public runFor(e: HotkeyEvent & Partial<EventBubbleControl>, scope: HotkeyScope) {
        if (scope === globalScope) {
            return this.runGlobal(e);
        } else if (scope === scopes.local) {
            return this.runLocal(e);
        } else if (typeof scope === 'string') {
            return this.runScope(e, scope);
        } else {
            throw TypeError('Invalid scope, only [Symbol global, [Symbol local] and strings are allowed');
        }
    }

    public subscribe(handler: (registry: HotkeyRegistry | null) => void) {
        subscriptions.add(handler);
        return () => {
            subscriptions.delete(handler);
        };
    }
}
