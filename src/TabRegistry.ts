import { DoublyLinkedOrderedSet } from '@secoya/collection.ts';

export type FocusOrigin =
    | 'child'
    | 'custom'
    | 'down'
    | 'keyboard'
    | 'left'
    | 'mouse'
    | 'next'
    | 'none'
    | 'parent'
    | 'prev'
    | 'right'
    | 'up'
    | 'user';

export interface FocuserOptions {
    focusFirstOnNextOrigin?: boolean;
    focusOrigin: FocusOrigin;
}

export type FocuserFn = (foucuserOpts: FocuserOptions) => boolean;
export type FocuserType<E = any> = TabRegistry<E> | FocuserFn;

export interface TabRegistryOptions {
    /**
     * When enabled the registry won't jump boundries
     * but just focus the opposite end of the tab registry.
     */
    cycle?: boolean;

    /**
     * If focus is called with origin next, focus first instead of last.
     */
    focusFirstOnNextOrigin?: boolean;

    /**
     * If focus is called with origin child focus next parent.
     */
    focusParentOnChildOrigin?: boolean;
}

const focusOriginNone: FocuserOptions = { focusOrigin: 'none' };
const focusOriginNext: FocuserOptions = { focusOrigin: 'next' };
const focusOriginPrev: FocuserOptions = { focusOrigin: 'prev' };
const focusOriginChild: FocuserOptions = { focusOrigin: 'child' };

/**
 * Library class for controlling complex nested linked structures.
 */
export class TabRegistry<E = string> {
    public get first(): FocuserType<E> | null {
        const first = this.firstKey;
        if (first == null) {
            return null;
        }
        return this.focuserMap.get(first) as FocuserType<E>;
    }

    /**
     * The first key of the registry.
     * Is `null` if registry is empty.
     */
    public get firstKey(): E | null {
        if (this.isEmpty) {
            return null;
        }
        return this.registry.first;
    }

    /**
     * Property is `true` when tab cycling is enabled.
     */
    public get isCycleEnabled() {
        return this.cycle === true;
    }

    /**
     * Property is `true` if the registry is empty.
     */
    public get isEmpty(): boolean {
        return this.registry.isEmpty;
    }

    public get last(): FocuserType<E> | null {
        const last = this.lastKey;
        if (last == null) {
            return null;
        }
        return this.focuserMap.get(last) as FocuserType<E>;
    }

    /**
     * The last key of the registry.
     * Is `null` if registry is empty.
     */
    public get lastKey(): E | null {
        if (this.isEmpty) {
            return null;
        }
        return this.registry.last;
    }

    /**
     * Get the parent registry if exists.
     */
    public get parentRegistry(): TabRegistry<E> | null {
        return this.internalParentRegistry;
    }

    /**
     * Get the root registry, recurse to toplevel.
     * If `this` registry has no parent return itself.
     */
    public get rootRegistry(): TabRegistry<E> | this {
        let registry: TabRegistry<E> = this;
        while (registry.parentRegistry != null) {
            registry = registry.parentRegistry;
        }
        return registry;
    }

    /**
     * Constructs any empty registry with default options.
     */
    public static empty<EStatic = any>(options?: TabRegistryOptions) {
        return new TabRegistry<EStatic>(options);
    }
    /**
     * Construct registry from nested map structure.
     */
    public static fromMap<EStatic = any>(map: Map<EStatic, any>, options?: TabRegistryOptions): TabRegistry<EStatic> {
        const registry = new TabRegistry<EStatic>(options);
        map.forEach((value: FocuserFn | Map<EStatic, FocuserFn>, key: EStatic) => {
            if (value instanceof Map) {
                const r = TabRegistry.fromMap(value);
                registry.add(key, r);
            } else {
                registry.add(key, value);
            }
        });
        return registry;
    }

    /**
     * When this is true, the registry won't jump boundries
     * but just focus the opposite end of the tab registry.
     */
    private cycle: boolean = false;

    /**
     * Indicator for if focus cycle is running.
     * This is used for detect infinite loops.
     */
    private focusCycleStartKey: E | null = null;

    /**
     * Internal map from key to a `focuser`
     */
    private focuserMap: Map<E, FocuserType<E>>;

    /**
     * Reference to the parent registry if it exists.
     */
    private internalParentRegistry: TabRegistry<E> | null;

    /**
     * The key to this registry from the parent registry if it exists.
     */
    private parentRegistryKey: any;

    /**
     * The internal set that maintain order.
     */
    private registry: DoublyLinkedOrderedSet<E>;

    /**
     * If focus is called with origin next, focus first instead of last.
     */
    public focusFirstOnNextOrigin: boolean;

    /**
     * If focus is called with origin child focus next parent.
     */
    public focusParentOnChildOrigin: boolean;

    /**
     * Constructs a registry with optional parent registry.
     */
    constructor(options?: TabRegistryOptions) {
        this.focuserMap = new Map();
        this.registry = new DoublyLinkedOrderedSet<E>();
        this.internalParentRegistry = null;
        if (options == null) {
            this.cycle = false;
            this.focusFirstOnNextOrigin = false;
            this.focusParentOnChildOrigin = false;
        } else {
            this.cycle = options.cycle === true;
            this.focusFirstOnNextOrigin = options.focusFirstOnNextOrigin === true;
            this.focusParentOnChildOrigin = options.focusParentOnChildOrigin === true;
        }
    }

    /**
     * Pretty print all the keys recursively.
     */
    private _toString(iterable: Iterable<E>, padding: string, level?: number): string {
        const lvl = level == null ? 1 : level;
        let result = '';
        let first = true;
        for (const key of Array.from(iterable)) {
            if (first) {
                first = false;
            } else {
                result += ',\n';
            }

            const val = this.focuserMap.get(key);
            if (val instanceof TabRegistry) {
                result += this._toString.call(val, val.keys(), padding + '    ', lvl + 1);
            } else {
                result += padding + key;
            }
        }
        return result;
    }

    /**
     * Enabling iterating through all the focusers.
     */
    public [Symbol.iterator] = function*(
        this: TabRegistry<E>,
        includeRegistries: boolean = false,
    ): IterableIterator<FocuserType<E>> {
        if (this.isEmpty) {
            return;
        }

        let key: E | null = this.firstKey;
        while (key) {
            const focuser = this.focuserMap.get(key);
            if (focuser instanceof TabRegistry) {
                if (includeRegistries) {
                    yield focuser;
                }
                yield* Array.from(focuser[Symbol.iterator](includeRegistries));
            } else {
                yield focuser as FocuserType<E>;
            }
            key = this.getNextKey(key);
        }
    };

    /**
     * Add a `focuser` to the registry referenced by `key`.
     */
    public add(key: E, focuser: FocuserType<E>): void {
        this.registry.add(key);
        this.focuserMap.set(key, focuser);
        if (focuser instanceof TabRegistry) {
            focuser.setParentRegistry(key, this);
        }
    }

    /**
     * Add a `focuser` to the registry after the `afterKey`
     * referenced by `key`.
     */
    public addAfter(key: E, focuser: FocuserType<E>, afterKey: E): void {
        this.registry.addAfter(key, afterKey);
        this.focuserMap.set(key, focuser);
        if (focuser instanceof TabRegistry) {
            focuser.setParentRegistry(key, this);
        }
    }

    /**
     * Add a `focuser` to the registry before the `beforeKey`
     * referenced by `key`.
     */
    public addBefore(key: E, focuser: FocuserType<E>, beforeKey: E): void {
        this.registry.addBefore(key, beforeKey);
        this.focuserMap.set(key, focuser);
        if (focuser instanceof TabRegistry) {
            focuser.setParentRegistry(key, this);
        }
    }

    /**
     * Delete `key` from the registry.
     */
    // tslint:disable-next-line:no-reserved-keywords
    public delete(key: E): void {
        this.registry.delete(key);
        this.focuserMap.delete(key);
    }

    /**
     * Disable tab cycling.
     */
    public disableCycle() {
        this.cycle = false;
        return this;
    }

    /**
     * Enable tab cycling.
     */
    public enableCycle() {
        this.cycle = true;
        return this;
    }
    /**
     * Execute focuser for `key`.
     * Returns `true` if the focuser was successful.
     * Returns `false` if the focuser does not exist.
     */
    public focus(key?: E, options?: FocuserOptions): boolean {
        const opts = options || focusOriginNone;
        if (this.focusParentOnChildOrigin && opts.focusOrigin === 'child') {
            return this.focusParent();
        }

        let internalKey: E | undefined | null = key;
        if (internalKey == null) {
            if (options != null && options.focusOrigin === 'next' && !options.focusFirstOnNextOrigin) {
                internalKey = this.lastKey;
            } else {
                internalKey = this.firstKey;
            }
            if (internalKey == null) {
                return false;
            }
        }

        const focuser = this.focuserMap.get(internalKey);
        if (focuser == null) {
            return false;
        }

        return focuser instanceof TabRegistry
            ? focuser.focus(undefined, { ...opts, focusFirstOnNextOrigin: focuser.focusFirstOnNextOrigin })
            : focuser(opts);
    }

    /**
     * Execute first focuser in the registry.
     * If the first entry is not focusable recursive through
     * the registry until a focuser returns `true`.
     *
     * Returns `true` if a focuser is successful.
     * Returns `false` if no focuser was sucessful.
     */
    public focusFirst(): boolean {
        if (this.registry.isEmpty) {
            return false;
        }

        const first = this.registry.first;
        const focuser = this.focuserMap.get(first);
        if (focuser == null) {
            /* istanbul ignore next */
            return false;
        }

        const result = focuser instanceof TabRegistry ? focuser.focusFirst() : focuser(focusOriginPrev);
        if (result) {
            return true;
        } else {
            if (this.cycle && this.focusCycleStartKey == null) {
                this.focusCycleStartKey = first;
            }
            return this.focusNext(first);
        }
    }

    /**
     * Excute focuser that matches the `keys` path
     * from the first key in the registry.
     */
    public focusFirstIn(keys: ReadonlyArray<E>): boolean {
        if (this.registry.isEmpty) {
            return false;
        }
        const first = this.registry.first;
        if (first == null) {
            /* istanbul ignore next */
            return false;
        }

        return this.focusIn([first, ...keys], focusOriginPrev);
    }

    /**
     * Execute focuser that matchs the `keys` path
     * the first key will be the root identifier.
     */
    public focusIn(keys: ReadonlyArray<E>, options?: FocuserOptions): boolean {
        // tslint:disable-next-line: prefer-const
        let [key, ...nextKeys] = keys;
        if (key == null) {
            return false;
        }
        let registry: TabRegistry<E> = this;
        while (registry.has(key)) {
            const focuser = registry.get(key);
            if (focuser == null) {
                /* istanbul ignore next */
                return false;
            }

            const k = nextKeys.shift();
            if (k != null) {
                key = k;
                if (focuser instanceof TabRegistry) {
                    registry = focuser;
                } else {
                    return false;
                }
            } else {
                if (focuser instanceof TabRegistry) {
                    return focuser.focus(undefined, options);
                } else {
                    if (options == null) {
                        return focuser(focusOriginNone);
                    } else {
                        return focuser(options);
                    }
                }
            }
        }

        return false;
    }

    /**
     * Execute last focuser in the registry.
     * If the last entry is not focusable recursive backwards through
     * the registry until a focuser returns `true`.
     *
     * Returns `true` if a focuser is successful.
     * Returns `false` if no focuser was sucessful.
     */
    public focusLast(): boolean {
        if (this.registry.isEmpty) {
            return false;
        }

        const last = this.registry.last;
        const focuser = this.focuserMap.get(last);
        if (focuser == null) {
            /* istanbul ignore next */
            return false;
        }

        const result =
            focuser instanceof TabRegistry
                ? focuser.focus(undefined, {
                      ...focusOriginNext,
                      focusFirstOnNextOrigin: focuser.focusFirstOnNextOrigin,
                  })
                : focuser(focusOriginNext);

        if (result) {
            return true;
        } else {
            if (this.cycle && this.focusCycleStartKey == null) {
                this.focusCycleStartKey = last;
            }
            return this.focusPrev(last);
        }
    }

    /**
     * Excute focuser that matches the `keys` path
     * from the last key in the registry.
     */
    public focusLastIn(keys: ReadonlyArray<E>): boolean {
        if (this.registry.isEmpty) {
            return false;
        }
        const last = this.registry.last;
        if (last == null) {
            /* istanbul ignore next */
            return false;
        }
        return this.focusIn([last, ...keys], focusOriginNext);
    }

    /**
     * Execute the focuser after `key`.
     * If the focuser was not successful recurse through
     * the registry until a focuser returns `true`.
     *
     * Returns `true` if a focuser is successful.
     * Returns `false` if no focuser was sucessful.
     */
    public focusNext(key: E): boolean {
        // remember to unset the focusCycleStartKey
        // for every return path of this function
        // if cycly is enabled.
        let focuser;
        let current;
        let next = this.getNextKey(key);
        const totalCount = this.registry.size;

        for (let i = totalCount; i > 0; i--) {
            if (next == null) {
                break;
            }

            current = next;
            focuser = this.focuserMap.get(current);
            next = this.getNextKey(current);

            if (focuser == null) {
                /* istanbul ignore next */
                continue;
            }

            const result = focuser instanceof TabRegistry ? focuser.focusFirst() : focuser(focusOriginPrev);

            if (result) {
                this.focusCycleStartKey = null;
                return true;
            }

            // stop cycling if we have seen the key before.
            if (this.cycle && current === this.focusCycleStartKey) {
                this.focusCycleStartKey = null;
                return false;
            }
        }

        if (this.cycle) {
            // if no cycle start key has been set before
            // then set it to the key this focusNext loop was started with.
            if (this.focusCycleStartKey == null) {
                this.focusCycleStartKey = key;

                // if the focus cycle start key is the same as
                // the key we started this loop with
            } else if (this.focusCycleStartKey === key) {
                this.focusCycleStartKey = null;
                return false;
            }
            return this.focusFirst();
        }

        if (this.internalParentRegistry != null) {
            this.focusCycleStartKey = null;
            this.internalParentRegistry.focusNext(this.parentRegistryKey);
            return true;
        }

        this.focusCycleStartKey = null;
        return false;
    }

    /**
     * Excute focuser that matches the `keys` path
     * from the key after the first key in `keys`.
     */
    public focusNextIn(keys: ReadonlyArray<E>): boolean {
        const [key, ...nextKeys] = keys;
        if (key == null) {
            return false;
        }
        const next = this.getNextKey(key);
        if (next == null) {
            return false;
        }
        return this.focusIn([next, ...nextKeys], focusOriginPrev);
    }

    /**
     * Focus the parent registry.
     */
    public focusParent(): boolean {
        if (this.internalParentRegistry != null) {
            return this.internalParentRegistry.focus(undefined, focusOriginChild);
        }
        return false;
    }

    /**
     * Execute the focuser before `key`.
     * If the focuser was not successful recurse backwards through
     * the registry until a focuser returns `true`.
     *
     * Returns `true` if a focuser is successful.
     * Returns `false` if no focuser was sucessful.
     */
    public focusPrev(key: E): boolean {
        // remember to unset the focusCycleStartKey
        // for every return path of this function
        // if cycly is enabled.
        let focuser;
        let current;
        let prev = this.getPrevKey(key);
        const totalCount = this.registry.size;

        for (let i = totalCount; i > 0; i--) {
            if (prev == null) {
                break;
            }

            current = prev;
            focuser = this.focuserMap.get(prev);
            prev = this.getPrevKey(prev);

            if (focuser == null) {
                /* istanbul ignore next */
                continue;
            }

            const result =
                focuser instanceof TabRegistry
                    ? focuser.focus(undefined, {
                          ...focusOriginNext,
                          focusFirstOnNextOrigin: focuser.focusFirstOnNextOrigin,
                      })
                    : focuser(focusOriginNext);

            if (result) {
                this.focusCycleStartKey = null;
                return true;
            }

            // stop cycling if we have seen the key before.
            if (this.cycle && current === this.focusCycleStartKey) {
                this.focusCycleStartKey = null;
                return false;
            }
        }

        if (this.cycle) {
            // if no cycle start key has been set before
            // then set it to the key this focusPrev loop was started with.
            if (this.focusCycleStartKey == null) {
                this.focusCycleStartKey = key;

                // if the focus cycle start key is the same as
                // the key we started this loop with
            } else if (this.focusCycleStartKey === key) {
                this.focusCycleStartKey = null;
                return false;
            }
            return this.focusLast();
        }

        if (this.internalParentRegistry != null) {
            this.focusCycleStartKey = null;
            this.internalParentRegistry.focusPrev(this.parentRegistryKey);
            return true;
        }

        this.focusCycleStartKey = null;
        return false;
    }

    /**
     * Excute focuser that matches the `keys` path
     * from the key before the first key in `keys`.
     */
    public focusPrevIn(keys: ReadonlyArray<E>): boolean {
        const [key, ...nextKeys] = keys;
        if (key == null) {
            return false;
        }
        const prev = this.getPrevKey(key);
        if (prev == null) {
            return false;
        }
        return this.focusIn([prev, ...nextKeys], focusOriginNext);
    }

    /**
     * Returns focuser for `key` if it exists
     * otherwise return `null`.
     */
    // tslint:disable-next-line:no-reserved-keywords
    public get(key: E): FocuserType<E> | null {
        const focuser = this.focuserMap.get(key);
        if (focuser == null) {
            return null;
        } else {
            return focuser;
        }
    }

    /**
     * Returns the forcuser after `key` if it exists
     * otherwise return `null`.
     */
    public getNext(key: E): FocuserType<E> | null {
        const next = this.getNextKey(key);
        if (next == null) {
            return null;
        }
        const focuser = this.focuserMap.get(next);
        if (focuser == null) {
            /* istanbul ignore next */
            return null;
        }
        return focuser;
    }

    /**
     * Returns the key next to the key parameter.
     */
    public getNextKey(key: E): E | null {
        return this.registry.next(key);
    }

    /**
     * Returns the forcuser before `key` if it exists
     * otherwise return `null`.
     */
    public getPrev(key: E): FocuserType<E> | null {
        const prev = this.getPrevKey(key);
        if (prev == null) {
            return null;
        }
        const focuser = this.focuserMap.get(prev);
        if (focuser == null) {
            /* istanbul ignore next */
            return null;
        }
        return focuser;
    }

    /**
     * Returns the key previous to the key parameter.
     */
    public getPrevKey(key: E): E | null {
        return this.registry.prev(key);
    }

    /**
     * Returns whether or not the focuser for `key` exists.
     */
    public has(key: E): boolean {
        return this.focuserMap.has(key);
    }

    /**
     * Test if nested focuser that matchs the `keys` path
     * from the first key exist.
     */
    public hasIn(keys: ReadonlyArray<E>): boolean {
        // tslint:disable-next-line: prefer-const
        let [key, ...nextKeys] = keys;
        if (key == null) {
            return false;
        }
        let registry: TabRegistry<E> = this;
        while (registry.has(key)) {
            const focuser = registry.get(key);
            if (focuser == null) {
                /* istanbul ignore next */
                return false;
            }

            const k = nextKeys.shift();
            if (k != null) {
                key = k;
                if (focuser instanceof TabRegistry) {
                    registry = focuser;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns whether or not there exists a focuser after `key`.
     */
    public hasNext(key: E): boolean {
        if (!this.registry.has(key)) {
            return false;
        }
        return this.getNextKey(key) != null;
    }

    /**
     * Returns whether or not there exists a focuser prev `key`.
     */
    public hasPrev(key: E): boolean {
        if (!this.registry.has(key)) {
            return false;
        }
        return this.getPrevKey(key) != null;
    }

    /**
     * Returns an iterator of all the `keys` in this registry.
     */
    public keys = function*(this: TabRegistry<E>): IterableIterator<E> {
        if (this.registry.isEmpty) {
            return;
        }

        let key: E | null = this.registry.first;
        while (key) {
            yield key;
            key = this.getNextKey(key);
        }
    };

    /**
     * Returns an iterator of all the `keys` in this
     * and all nested registries.
     */
    public keysRecursive = function*(this: TabRegistry<E>, includeRegistries: boolean = true): IterableIterator<E> {
        if (this.registry.isEmpty) {
            return;
        }

        let key: E | null = this.registry.first;
        while (key) {
            const focuser = this.focuserMap.get(key);
            if (focuser instanceof TabRegistry) {
                if (includeRegistries) {
                    yield key;
                }
                yield* Array.from(focuser.keysRecursive(includeRegistries));
            } else {
                yield key;
            }
            key = this.getNextKey(key);
        }
    };

    /**
     * Move a focuser to the next spot in the registry.
     */
    public moveNext(key: E): void {
        const focuser = this.focuserMap.get(key);
        if (focuser == null) {
            throw new Error(`Focuser for ${key} was not found`);
        }
        const next = this.getNextKey(key);
        if (next != null) {
            this.registry.setAfter(key, next);
        }
    }

    /**
     * Move a focuser to the previous spot in the registry.
     */
    public movePrev(key: E): void {
        const focuser = this.focuserMap.get(key);
        if (focuser == null) {
            throw new Error(`Focuser for ${key} was not found`);
        }
        const prev = this.getPrevKey(key);
        if (prev != null) {
            this.registry.setBefore(key, prev);
        }
    }

    /**
     * Overwrite focuser for `key`.
     * It throws if `key` does not exist.
     */
    // tslint:disable-next-line:no-reserved-keywords
    public set(key: E, focuser: FocuserType<E>) {
        const existingFocuser = this.focuserMap.get(key);
        if (existingFocuser == null) {
            throw new Error(`Key does not exist: ${key}`);
        } else {
            this.focuserMap.set(key, focuser);
        }
    }

    /**
     * Set the `key` of this registry from
     * the `parentRegistry`.
     */
    public setParentRegistry(parentRegistryKey: any, parentRegistry: TabRegistry<E>) {
        this.internalParentRegistry = parentRegistry;
        this.parentRegistryKey = parentRegistryKey;
    }

    /**
     * Returns a string representation of this
     * and all nested registries.
     */
    public toString() {
        return 'TabRegistry[\n' + this._toString(this.registry, '    ') + '\n' + ']';
    }
}
