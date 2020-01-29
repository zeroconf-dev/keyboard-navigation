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

type HotkeyPublicScope = typeof scopes.local | 'string';

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

class HotkeyRegistry {
	private readonly hotkeys: Map<HotkeyID, [HotkeyID, string, HotKey, (() => boolean)]> = new Map();
	public readonly crossGlobalBoundary: boolean;
	public readonly crossLocalBoundary: boolean;
	public readonly parent: HotkeyRegistry;
	public readonly scope: HotkeyScope;
	public readonly scopes: Map<string, Set<HotkeyRegistry>> = new Map();

	public static for(
		scope: HotkeyPublicScope,
		parent: HotkeyRegistry,
		options: HotkeyRegistryOptions = {
			crossGlobalBoundary: true,
			crossLocalBoundary: true,
		},
	) {
		return new HotkeyRegistry(scope, parent, options);
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

	public iterLocal = function*(this: HotkeyRegistry): Generator<HotkeyRegistry, void, undefined> {
		yield this;

		if (this.crossLocalBoundary) {
			if (this.parent !== this.global) {
				yield* this.parent.iterLocal();
			}
		}

		if (this.crossGlobalBoundary) {
			yield this.global;
		}

		return;
	};

	public iterScope = function*(this: HotkeyRegistry, scope: string): Generator<HotkeyRegistry, void, undefined> {
		const registries = this.scopes.get(scope);

		if (registries != null) {
			for (const registry of registries) {
				if (this.scope !== scope && registry !== this) {
					yield registry;
				}
			}
		}

		if (this.scope === scope) {
			yield* this.iterLocal();
		}

		return;
	};

	public run(e: HotKeyEvent): boolean {
		for (const hotkey of this.hotkeys.values()) {
			if (isHotkeyMatching(hotkey[2], e)) {
				if (hotkey[3]()) {
					(e as any).preventDefault();
					(e as any).stopPropagation();
					return true;
				}
			}
		}
		return false;
	}

	public runCurrent(e: HotKeyEvent): boolean {
		return this.runFor(e, this.scope);
	}

	public runFor(e: HotKeyEvent, scope: HotkeyScope) {
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

	private runGlobal(e: HotKeyEvent): boolean {
		return this.global.run(e);
	}

	private runLocal(e: HotKeyEvent): boolean {
		for (const registry of this.iterLocal()) {
			if (registry.run(e)) {
				return true;
			}
		}
		return false;
	}

	private runScope(e: HotKeyEvent, scope: string): boolean {
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
			HotkeyRegistry.for(scope, parentRegistry, {
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
