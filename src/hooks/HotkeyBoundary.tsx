import { HotKeyEvent, isHotkeyMatching } from '@zeroconf/keyboard-navigation/hotkeys/createHandler';
import { HotKey, parse } from '@zeroconf/keyboard-navigation/hotkeys/parser';
import { createContext, useContext, useMemo, useEffect, useCallback } from 'react';
import * as React from 'react';

const scopes = {
	global: Symbol('global'),
	local: Symbol('local'),
} as {
	readonly global: unique symbol;
	readonly local: unique symbol;
};

interface EventBubbleControl {
	preventDefault: () => void;
	stopPropagation: () => void;
}
type HotkeyPublicScope = typeof scopes.local | string;
type HotkeyScope = HotkeyPublicScope | typeof scopes.global;

let globalRegistry: HotkeyRegistry | null = null;

enum HotkeyIDBrand {}
type HotkeyID = HotkeyIDBrand & number;
let _hotkeyId = 0 as HotkeyID;
const nextHotkeyId = () => _hotkeyId++;

interface HotkeyRegistryOptions {
	crossGlobalBoundary?: boolean;
	crossLocalBoundary?: boolean;
}

export class HotkeyRegistry {
	private readonly hotkeys: Map<HotkeyID, [HotkeyID, string, HotKey, (() => boolean)]> = new Map();
	public readonly crossGlobalBoundary: boolean;
	public readonly crossLocalBoundary: boolean;
	public readonly parent: HotkeyRegistry;
	public readonly scope: HotkeyScope;
	public readonly scopes: Map<string, Set<HotkeyRegistry>> = new Map();

	public static for(parent: HotkeyRegistry, options?: HotkeyRegistryOptions): HotkeyRegistry;
	public static for(
		parent: HotkeyRegistry,
		scope?: HotkeyPublicScope,
		options?: HotkeyRegistryOptions,
	): HotkeyRegistry;
	public static for(
		parent: HotkeyRegistry,
		scope: HotkeyPublicScope | HotkeyRegistryOptions = {
			crossGlobalBoundary: true,
			crossLocalBoundary: true,
		},
		options: HotkeyRegistryOptions = {
			crossGlobalBoundary: true,
			crossLocalBoundary: true,
		},
	) {
		const newScope = typeof scope === 'object' ? scopes.local : scope;
		const newOptions = typeof scope === 'object' ? scope : options;
		return new HotkeyRegistry(newScope, parent, newOptions);
	}

	public static get global() {
		if (globalRegistry == null) {
			globalRegistry = new HotkeyRegistry(scopes.global, null);
		}
		return globalRegistry;
	}

	private constructor(
		scope: HotkeyScope,
		parent: HotkeyRegistry | null,
		options: HotkeyRegistryOptions = {
			crossGlobalBoundary: true,
			crossLocalBoundary: true,
		},
	) {
		if (scope === scopes.global) {
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

	public add(hotkeyStr: string, hotkey: HotKey, handler: () => boolean): HotkeyID {
		const hotkeyId = nextHotkeyId();
		this.hotkeys.set(hotkeyId, [hotkeyId, hotkeyStr, hotkey, handler]);
		return hotkeyId;
	}

	public iterLocal = function*(this: HotkeyRegistry): Generator<HotkeyRegistry, void, void> {
		let reg = this;
		while (true) {
			if (reg === this.global || reg == null) {
				return; // never yield global from iterLocal
			}
			yield reg;
			if (!reg.crossLocalBoundary) {
				return;
			}
			reg = reg.parent;
		}
	};

	private getCrossGlobalBoundary() {
		let reg: HotkeyRegistry = this;
		while (true) {
			if (reg === this.global || reg == null) {
				return true;
			}
			if (!reg.crossGlobalBoundary) {
				return false;
			}
			reg = reg.parent;
		}
	}

	public [Symbol.iterator] = function*(this: HotkeyRegistry): Generator<HotkeyRegistry, void, void> {
		yield* this.iterLocal();
		if (this.getCrossGlobalBoundary()) {
			yield this.global;
		}
		return;
	};

	public iterScope = function*(this: HotkeyRegistry, scope: string): Generator<HotkeyRegistry, void, undefined> {
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

	public run(e: HotKeyEvent & Partial<EventBubbleControl>): boolean {
		for (const hotkey of this.hotkeys.values()) {
			if (isHotkeyMatching(hotkey[2], e)) {
				if (hotkey[3]()) {
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

	public runCurrent(e: HotKeyEvent & Partial<EventBubbleControl>): boolean {
		return this.runFor(e, this.scope);
	}

	public iterLocalHotkeys = function*(this: HotkeyRegistry): Generator<HotKey, void, void> {
		for (const reg of this.iterLocal()) {
			for (const hotkey of reg.hotkeys.values()) {
				yield hotkey[2];
			}
		}
		return;
	};

	public iterHotkeys = function*(this: HotkeyRegistry): Generator<HotKey, void, void> {
		for (const reg of this) {
			for (const hotkey of reg.hotkeys.values()) {
				yield hotkey[2];
			}
		}
	};

	public runFor(e: HotKeyEvent & Partial<EventBubbleControl>, scope: HotkeyScope) {
		if (scope === scopes.global) {
			return this.runGlobal(e);
		} else if (scope === scopes.local) {
			return this.runLocal(e);
		} else if (typeof scope === 'string') {
			return this.runScope(e, scope);
		} else {
			throw TypeError('Invalid scope, only [Symbol global, [Symbol local] and strings are allowed');
		}
	}

	private runGlobal(e: HotKeyEvent & Partial<EventBubbleControl>): boolean {
		return this.global.run(e);
	}

	private runLocal(e: HotKeyEvent & Partial<EventBubbleControl>): boolean {
		for (const registry of this) {
			if (registry.run(e)) {
				return true;
			}
		}
		return false;
	}

	private runScope(e: HotKeyEvent & Partial<EventBubbleControl>, scope: string): boolean {
		for (const registry of this.iterScope(scope)) {
			if (registry.run(e)) {
				return true;
			}
		}
		return false;
	}

	public get global() {
		return HotkeyRegistry.global;
	}

	public remove(hotkeyId: HotkeyID) {
		this.hotkeys.delete(hotkeyId);
	}

	public dispose() {
		if (typeof this.scope === 'string') {
			const registries = this.global.scopes.get(this.scope);
			if (registries != null) {
				registries.delete(this);
			}
		}
		if (this.scope === scopes.global) {
			globalRegistry = null;
		}
	}
}

const HotkeyContext = createContext(HotkeyRegistry.global);
export const HotkeyContextProvider = HotkeyContext.Provider;

interface HotkeyBoundaryProps {
	scope: HotkeyPublicScope;
	crossGlobalBoundary: boolean;
	crossLocalBoundary: boolean;
}
export const useHotkeyRegistry = () => useContext(HotkeyContext);

export const HotkeyBoundary = (props: React.PropsWithChildren<HotkeyBoundaryProps>) => {
	const { crossGlobalBoundary, crossLocalBoundary, scope } = props;
	const parentRegistry = useHotkeyRegistry();
	const registry = useMemo(
		() =>
			HotkeyRegistry.for(parentRegistry, scope, {
				crossGlobalBoundary,
				crossLocalBoundary,
			}),
		[scope, parentRegistry, crossGlobalBoundary, crossLocalBoundary],
	);
	useEffect(() => () => registry.dispose(), [registry]);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			registry.runCurrent(e);
		},
		[registry],
	);

	return (
		<HotkeyContextProvider value={registry}>
			<div onKeyDown={onKeyDown}>{props.children}</div>
		</HotkeyContextProvider>
	);
};

HotkeyBoundary.defaultProps = {
	crossGlobalBoundary: true,
	crossLocalBoundary: true,
	scope: scopes.local,
};

export const useHotkey = (hotkeyStr: string, handler: () => boolean) => {
	const registry = useHotkeyRegistry();
	const hotkey = useMemo(() => parse(hotkeyStr), [hotkeyStr]);
	useEffect(() => {
		const hotkeyId = registry.add(hotkeyStr, hotkey, handler);
		return () => registry.remove(hotkeyId);
	}, [registry, hotkey, hotkeyStr, handler]);
};
