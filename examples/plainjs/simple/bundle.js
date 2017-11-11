(function (React,ReactDOM) {
'use strict';

/**
 * The base error for this package.
 */
class CollectionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CollectionError';
        Object.setPrototypeOf(this, CollectionError.prototype);
    }
}

/**
 * Error type for sets.
 */
class SetError extends CollectionError {
    constructor(message) {
        super(message);
        this.name = 'SetError';
        Object.setPrototypeOf(this, SetError.prototype);
    }
    /**
     * Error thrown when trying to set a new value
     * that already exists.
     */
    static duplicate(value) {
        return new SetError(`The value ${value} does already exist`);
    }
    /**
     * Error thrown when trying to set a new value
     * that already exists.
     */
    static noElements() {
        return new SetError('The set is empty');
    }
    /**
     * Error thrown when trying to set a new value
     * that already exists.
     */
    static notExists(value) {
        return new SetError(`The value ${value} does not exist`);
    }
}

/**
 * Internal data structure used to model doubly linked items.
 */
class DoubleLinkedItem {
    constructor(value, prev, next) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

/**
 * Doubly Linked Ordered Set.
 */
class DoublyLinkedOrderedSet {
    constructor(values) {
        /**
         * Adds `value` to the set.
         */
        this.internalAdd = (value) => {
            const lastItem = this.lastItem;
            const item = new DoubleLinkedItem(value, lastItem, null);
            if (lastItem != null) {
                lastItem.next = item;
            }
            this.arrayList.push(item);
            this.valueMap.set(value, item);
        };
        /**
         * Enables iterating in `for..of` loops.
         */
        this[Symbol.iterator] = function* () {
            if (this.isEmpty) {
                return;
            }
            let item = this.firstItem;
            while (item != null) {
                yield item.value;
                item = item.next;
            }
            return;
        };
        /**
         * Adds `value` to the set.
         * If the `value` already exist a `SetError` is thrown.
         */
        this.add = (value) => {
            if (this.valueMap.has(value)) {
                throw new SetError(`The value: ${value} already exists`);
            }
            this.internalAdd(value);
        };
        /**
         * Returns an entries iterator.
         */
        this.entries = function* () {
            if (this.isEmpty) {
                return null;
            }
            let item = this.firstItem;
            while (item != null) {
                yield [item.value, item.value];
                item = item.next;
            }
            return null;
        };
        this.arrayList = [];
        this.valueMap = new Map();
        if (values != null) {
            for (const value of Array.from(values)) {
                this.add(value);
            }
        }
    }
    /**
     * The first value of the ordered set.
     * Throws a `SetError` if the set is empty.
     */
    get first() {
        const firstItem = this.firstItem;
        if (firstItem == null) {
            throw SetError.noElements();
        }
        return firstItem.value;
    }
    /**
     * The first internal data structure item of the ordered set.
     * Throws a `SetError` if the set is empty.
     */
    get firstItem() {
        if (this.isEmpty) {
            return null;
        }
        return this.arrayList[0];
    }
    /**
     * The property is true if the set is empty.
     */
    get isEmpty() {
        return this.size === 0;
    }
    /**
     * The last value of the set.
     * Throws a `SetError` if the set is empty.
     */
    get last() {
        const lastItem = this.lastItem;
        if (lastItem == null) {
            throw SetError.noElements();
        }
        return lastItem.value;
    }
    /**
     * The last internal data structure item of the ordered set.
     * Throws a `SetError` if the set is empty.
     */
    get lastItem() {
        if (this.isEmpty) {
            return null;
        }
        return this.arrayList[this.arrayList.length - 1];
    }
    /**
     * The amount of values in the set.
     */
    get size() {
        return this.arrayList.length;
    }
    /**
     * Constructs an empty `DoublyLinkedOrderedSet`.
     */
    static empty() {
        return new DoublyLinkedOrderedSet();
    }
    /**
     * Constructs a `DoublyLinkedOrderedSet` from an Iterable.
     */
    // tslint:disable-next-line:no-reserved-keywords
    static from(values) {
        return new DoublyLinkedOrderedSet(values);
    }
    /**
     * Constructs a `DoublyLinkedOrderedSet` from
     * with a value from each argument.
     * If no arguments are provided it constructs an empty set.
     */
    // tslint:disable-next-line:no-reserved-keywords
    static of(...values) {
        return DoublyLinkedOrderedSet.from(values);
    }
    /**
     * Sets `value` `afterValue`.
     * If `value` already exist a `SetError` is thrown.
     * If `afterValue` does not exist a `SetError` is thrown.
     */
    addAfter(value, afterValue) {
        if (this.valueMap.has(value)) {
            throw SetError.duplicate(value);
        }
        const afterItem = this.valueMap.get(afterValue);
        if (afterItem == null) {
            throw SetError.notExists(afterValue);
        }
        const afterIdx = this.arrayList.indexOf(afterItem);
        if (afterIdx === -1) {
            throw new Error(`The after value exist in valueMap but item does not exist in internal array list`);
        }
        const newItem = new DoubleLinkedItem(value, afterItem, afterItem.next);
        if (afterItem.next != null) {
            afterItem.next.prev = newItem;
        }
        afterItem.next = newItem;
        this.arrayList.splice(afterIdx + 1, 0, newItem);
        this.valueMap.set(value, newItem);
    }
    /**
     * Sets `value` `beforeValue`.
     * If `value` already exist a `SetError` is thrown.
     * If `beforeValue` does not exist a `SetError` is thrown.
     */
    addBefore(value, beforeValue) {
        if (this.valueMap.has(value)) {
            throw SetError.duplicate(value);
        }
        const beforeItem = this.valueMap.get(beforeValue);
        if (beforeItem == null) {
            throw SetError.notExists(beforeValue);
        }
        const beforeIdx = this.arrayList.indexOf(beforeItem);
        if (beforeIdx === -1) {
            throw new Error(`The after value exist in valueMap but item does not exist in internal array list`);
        }
        const newItem = new DoubleLinkedItem(value, beforeItem.prev, beforeItem);
        if (beforeItem.prev != null) {
            beforeItem.prev.next = newItem;
        }
        beforeItem.prev = newItem;
        this.arrayList.splice(beforeIdx, 0, newItem);
        this.valueMap.set(value, newItem);
    }
    /**
     * Clears the set for all values.
     */
    clear() {
        this.arrayList = [];
        this.valueMap.clear();
    }
    /**
     * Deletes a single `value` from the set.
     * If the value does not exist, a `SetError` is thrown.
     */
    // tslint:disable-next-line:no-reserved-keywords
    delete(value) {
        const item = this.valueMap.get(value);
        if (item == null) {
            throw new SetError(`The value ${value} does not exist`);
        }
        const idx = this.arrayList.indexOf(item);
        if (idx === -1) {
            throw new SetError(`The value ${value} was not found in internal array but in valueMap`);
        }
        if (item.prev != null) {
            item.prev.next = item.next;
        }
        if (item.next != null) {
            item.next.prev = item.prev;
        }
        this.arrayList.splice(idx, 1);
        this.valueMap.delete(value);
    }
    /**
     * Enables to call `iter` on each value in the set.
     */
    forEeach(iter) {
        this.arrayList.forEach((e, i) => iter(e.value, i));
    }
    /**
     * Returns true if `value` exists in the set, otherwise false.
     */
    has(value) {
        return this.valueMap.has(value);
    }
    /**
     * Returns the value after `value`.
     * If `value` does not exist a `SetError` is thrown.
     * If `value` is the _last_ value `null` is returned.
     */
    next(value) {
        const item = this.valueMap.get(value);
        if (item == null) {
            throw SetError.notExists(value);
        }
        if (item.next == null) {
            return null;
        }
        return item.next.value;
    }
    /**
     * Returns the value before `value`.
     * If `value` does not exist a `SetError` is thrown.
     * If `value` is the _first_ value `null` is returned.
     */
    prev(value) {
        const item = this.valueMap.get(value);
        if (item == null) {
            throw SetError.notExists(value);
        }
        if (item.prev == null) {
            return null;
        }
        return item.prev.value;
    }
    /**
     * Overwrites an `existingValue` with `newValue`.
     * If `newValue` already exist a `SetError` is thrown.
     * If `existingValue` does not exist a `SetError` is thrown.
     */
    // tslint:disable-next-line:no-reserved-keywords
    set(existingValue, newValue) {
        if (this.valueMap.has(newValue)) {
            throw SetError.duplicate(newValue);
        }
        const item = this.valueMap.get(existingValue);
        if (item == null) {
            throw SetError.notExists(existingValue);
        }
        item.value = newValue;
        this.valueMap.delete(existingValue);
        this.valueMap.set(newValue, item);
    }
    /**
     * Moves `existingValue` after `afterValue` in the set.
     * If any of `existingValue` or `afterValue` don't exist
     * a `SetError` is thrown.
     */
    setAfter(existingValue, afterValue) {
        if (!this.valueMap.has(existingValue)) {
            throw SetError.notExists(existingValue);
        }
        const afterItem = this.valueMap.get(afterValue);
        if (afterItem == null) {
            throw SetError.notExists(afterValue);
        }
        if (existingValue === afterValue) {
            throw SetError.duplicate(existingValue);
        }
        this.delete(existingValue);
        this.addAfter(existingValue, afterValue);
    }
    /**
     * Moves `existingValue` before `beforeValue` in the set.
     * If any of `existingValue` or `beforeValue` don't exist
     * a `SetError` is thrown.
     */
    setBefore(existingValue, beforeValue) {
        if (!this.valueMap.has(existingValue)) {
            throw SetError.notExists(existingValue);
        }
        const beforeItem = this.valueMap.get(beforeValue);
        if (beforeItem == null) {
            throw SetError.notExists(beforeValue);
        }
        if (existingValue === beforeValue) {
            throw SetError.duplicate(existingValue);
        }
        this.delete(existingValue);
        this.addBefore(existingValue, beforeValue);
    }
    /**
     * Returns string representation of the values in the set.
     */
    toString() {
        if (this.arrayList.length > 3) {
            return 'DoublyLinkedOrderedSet[\n' + this.arrayList.map(e => '    ' + e.value).join(',\n') + '\n]';
        }
        else {
            return `DoublyLinkedOrderedSet[${this.arrayList.map(e => e.value).join(', ')}]`;
        }
    }
    /**
     * Returns an iterator of the values in the set.
     */
    values() {
        return this[Symbol.iterator]();
    }
}

const focusOriginNone = { focusOrigin: 'none' };
const focusOriginNext = { focusOrigin: 'next' };
const focusOriginPrev = { focusOrigin: 'prev' };
/**
 * Library class for controlling complex nested linked structures.
 */
class TabRegistry {
    /**
     * Constructs a registry with optional parent registry.
     */
    constructor(options) {
        /**
         * When this is true, the registry won't jump boundries
         * but just focus the opposite end of the tab registry.
         */
        this.cycle = false;
        /**
         * Enabling iterating through all the focusers.
         */
        this[Symbol.iterator] = function* () {
            if (this.isEmpty) {
                return;
            }
            let key = this.firstKey;
            while (key) {
                if (key instanceof TabRegistry) {
                    yield* Array.from(key);
                }
                else {
                    yield this.focuserMap.get(key);
                }
                key = this.registry.next(key);
            }
        };
        /**
         * Returns an iterator of all the `keys` in this registry.
         */
        this.keys = function* () {
            if (this.registry.isEmpty) {
                return;
            }
            let key = this.registry.first;
            while (key) {
                yield key;
                key = this.registry.next(key);
            }
        };
        /**
         * Returns an iterator of all the `keys` in this
         * and all nested registries.
         */
        this.keysRecursive = function* () {
            if (this.registry.isEmpty) {
                return;
            }
            let key = this.registry.first;
            while (key) {
                const focuser = this.focuserMap.get(key);
                if (focuser instanceof TabRegistry) {
                    yield* Array.from(focuser.keysRecursive());
                }
                else {
                    yield key;
                }
                key = this.registry.next(key);
            }
        };
        this.focuserMap = new Map();
        this.registry = new DoublyLinkedOrderedSet();
        this.parentRegistry = null;
        if (options != null) {
            this.cycle = options.cycle === true;
        }
        else {
            this.cycle = false;
        }
    }
    get first() {
        const first = this.firstKey;
        if (first == null) {
            return null;
        }
        return this.focuserMap.get(first);
    }
    /**
     * The first key of the registry.
     * Is `null` if registry is empty.
     */
    get firstKey() {
        if (this.isEmpty) {
            return null;
        }
        return this.registry.first;
    }
    /**
     * Property is `true` when tab cycling is enabled.
     */
    get isCycleEnabled() {
        return this.cycle === true;
    }
    /**
     * Property is `true` if the registry is empty.
     */
    get isEmpty() {
        return this.registry.isEmpty;
    }
    get last() {
        const last = this.lastKey;
        if (last == null) {
            return null;
        }
        return this.focuserMap.get(last);
    }
    /**
     * The last key of the registry.
     * Is `null` if registry is empty.
     */
    get lastKey() {
        if (this.isEmpty) {
            return null;
        }
        return this.registry.last;
    }
    /**
     * Constructs any empty registry with default options.
     */
    static empty() {
        return new TabRegistry();
    }
    /**
     * Construct registry from nested map structure.
     */
    static fromMap(map, options) {
        const registry = new TabRegistry(options);
        map.forEach((value, key) => {
            if (value instanceof Map) {
                const r = TabRegistry.fromMap(value);
                registry.add(key, r);
            }
            else {
                registry.add(key, value);
            }
        });
        return registry;
    }
    /**
     * Pretty print all the keys recursively.
     */
    _toString(iterable, padding, level) {
        const lvl = level == null ? 1 : level;
        let result = '';
        let first = true;
        for (const key of Array.from(iterable)) {
            if (first) {
                first = false;
            }
            else {
                result += ',\n';
            }
            const val = this.focuserMap.get(key);
            if (val instanceof TabRegistry) {
                result += this._toString.call(val, val.keys(), padding + '    ', lvl + 1);
            }
            else {
                result += padding + key;
            }
        }
        return result;
    }
    /**
     * Add a `focuser` to the registry referenced by `key`.
     */
    add(key, focuser) {
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
    addAfter(key, focuser, afterKey) {
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
    addBefore(key, focuser, beforeKey) {
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
    delete(key) {
        this.registry.delete(key);
        this.focuserMap.delete(key);
    }
    /**
     * Disable tab cycling.
     */
    disableCycle() {
        this.cycle = false;
        return this;
    }
    /**
     * Enable tab cycling.
     */
    enableCycle() {
        this.cycle = true;
        return this;
    }
    /**
     * Execute focuser for `key`.
     * Returns `true` if the focuser was successful.
     * Returns `false` if the focuser does not exist.
     */
    focus(key, options) {
        let internalKey = key;
        if (internalKey == null) {
            if (options != null && options.focusOrigin === 'next') {
                internalKey = this.lastKey;
            }
            else {
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
        return focuser instanceof TabRegistry ? focuser.focus(undefined, options) : focuser(options || focusOriginNone);
    }
    /**
     * Execute first focuser in the registry.
     * If the first entry is not focusable recursive through
     * the registry until a focuser returns `true`.
     *
     * Returns `true` if a focuser is successful.
     * Returns `false` if no focuser was sucessful.
     */
    focusFirst() {
        if (this.registry.isEmpty) {
            return false;
        }
        const first = this.registry.first;
        const focuser = this.focuserMap.get(first);
        if (focuser == null) {
            return false;
        }
        const result = focuser instanceof TabRegistry ? focuser.focusFirst() : focuser(focusOriginPrev);
        if (result) {
            return true;
        }
        else {
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
    focusFirstIn(keys) {
        if (this.registry.isEmpty) {
            return false;
        }
        const first = this.registry.first;
        if (first == null) {
            return false;
        }
        return this.focusIn([first, ...keys], focusOriginPrev);
    }
    /**
     * Execute focuser that matchs the `keys` path
     * the first key will be the root identifier.
     */
    focusIn(keys, options) {
        let key = keys.shift();
        if (key == null) {
            return false;
        }
        let registry = this;
        while (registry.has(key)) {
            const focuser = registry.get(key);
            if (focuser == null) {
                return false;
            }
            const k = keys.shift();
            if (k != null) {
                key = k;
                if (focuser instanceof TabRegistry) {
                    registry = focuser;
                }
                else {
                    return false;
                }
            }
            else {
                if (focuser instanceof TabRegistry) {
                    return focuser.focus(undefined, options);
                }
                else {
                    if (options == null) {
                        return focuser(focusOriginNone);
                    }
                    else {
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
    focusLast() {
        if (this.registry.isEmpty) {
            return false;
        }
        const last = this.registry.last;
        const focuser = this.focuserMap.get(last);
        if (focuser == null) {
            return false;
        }
        const result = focuser instanceof TabRegistry ? focuser.focusLast() : focuser(focusOriginNext);
        if (result) {
            return true;
        }
        else {
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
    focusLastIn(keys) {
        if (this.registry.isEmpty) {
            return false;
        }
        const last = this.registry.last;
        if (last == null) {
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
    focusNext(key) {
        // remember to unset the focusCycleStartKey
        // for every return path of this function
        // if cycly is enabled.
        let focuser;
        let current;
        let next = this.registry.next(key);
        const totalCount = this.registry.size;
        for (let i = totalCount; i > 0; i--) {
            if (next == null) {
                break;
            }
            current = next;
            focuser = this.focuserMap.get(current);
            next = this.registry.next(current);
            if (focuser == null) {
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
            }
            else if (this.focusCycleStartKey === key) {
                this.focusCycleStartKey = null;
                return false;
            }
            return this.focusFirst();
        }
        if (this.parentRegistry != null) {
            this.focusCycleStartKey = null;
            this.parentRegistry.focusNext(this.parentRegistryKey);
            return true;
        }
        this.focusCycleStartKey = null;
        return false;
    }
    /**
     * Excute focuser that matches the `keys` path
     * from the key after the first key in `keys`.
     */
    focusNextIn(keys) {
        const key = keys.shift();
        if (key == null) {
            return false;
        }
        const next = this.registry.next(key);
        if (next == null) {
            return false;
        }
        return this.focusIn([next, ...keys], focusOriginPrev);
    }
    /**
     * Execute the focuser before `key`.
     * If the focuser was not successful recurse backwards through
     * the registry until a focuser returns `true`.
     *
     * Returns `true` if a focuser is successful.
     * Returns `false` if no focuser was sucessful.
     */
    focusPrev(key) {
        // remember to unset the focusCycleStartKey
        // for every return path of this function
        // if cycly is enabled.
        let focuser;
        let current;
        let prev = this.registry.prev(key);
        const totalCount = this.registry.size;
        for (let i = totalCount; i > 0; i--) {
            if (prev == null) {
                break;
            }
            current = prev;
            focuser = this.focuserMap.get(prev);
            prev = this.registry.prev(prev);
            if (focuser == null) {
                continue;
            }
            const result = focuser instanceof TabRegistry ? focuser.focusLast() : focuser(focusOriginNext);
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
            }
            else if (this.focusCycleStartKey === key) {
                this.focusCycleStartKey = null;
                return false;
            }
            return this.focusLast();
        }
        if (this.parentRegistry != null) {
            this.focusCycleStartKey = null;
            this.parentRegistry.focusPrev(this.parentRegistryKey);
            return true;
        }
        this.focusCycleStartKey = null;
        return false;
    }
    /**
     * Excute focuser that matches the `keys` path
     * from the key before the first key in `keys`.
     */
    focusPrevIn(keys) {
        const key = keys.shift();
        if (key == null) {
            return false;
        }
        const prev = this.registry.prev(key);
        if (prev == null) {
            return false;
        }
        return this.focusIn([prev, ...keys], focusOriginNext);
    }
    /**
     * Returns focuser for `key` if it exists
     * otherwise return `null`.
     */
    // tslint:disable-next-line:no-reserved-keywords
    get(key) {
        const focuser = this.focuserMap.get(key);
        if (focuser == null) {
            return null;
        }
        else {
            return focuser;
        }
    }
    /**
     * Returns the forcuser after `key` if it exists
     * otherwise return `null`.
     */
    getNext(key) {
        const next = this.registry.next(key);
        if (next == null) {
            return null;
        }
        const focuser = this.focuserMap.get(next);
        if (focuser == null) {
            return null;
        }
        return focuser;
    }
    /**
     * Returns the forcuser before `key` if it exists
     * otherwise return `null`.
     */
    getPrev(key) {
        const prev = this.registry.prev(key);
        if (prev == null) {
            return null;
        }
        const focuser = this.focuserMap.get(prev);
        if (focuser == null) {
            return null;
        }
        return focuser;
    }
    /**
     * Returns whether or not the focuser for `key` exists.
     */
    has(key) {
        return this.focuserMap.has(key);
    }
    /**
     * Test if nested focuser that matchs the `keys` path
     * from the first key exist.
     */
    hasIn(keys) {
        let key = keys.shift();
        if (key == null) {
            return false;
        }
        let registry = this;
        while (registry.has(key)) {
            const focuser = registry.get(key);
            if (focuser == null) {
                return false;
            }
            const k = keys.shift();
            if (k != null) {
                key = k;
                if (focuser instanceof TabRegistry) {
                    registry = focuser;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns whether or not there exists a focuser after `key`.
     */
    hasNext(key) {
        if (!this.registry.has(key)) {
            return false;
        }
        return this.registry.next(key) != null;
    }
    /**
     * Returns whether or not there exists a focuser prev `key`.
     */
    hasPrev(key) {
        if (!this.registry.has(key)) {
            return false;
        }
        return this.registry.prev(key) != null;
    }
    /**
     * Move a focuser to the next spot in the registry.
     */
    moveNext(key) {
        const focuser = this.focuserMap.get(key);
        if (focuser == null) {
            throw new Error(`Focuser for ${key} was not found`);
        }
        const next = this.registry.next(key);
        if (next != null) {
            this.registry.setAfter(key, next);
        }
    }
    /**
     * Move a focuser to the previous spot in the registry.
     */
    movePrev(key) {
        const focuser = this.focuserMap.get(key);
        if (focuser == null) {
            throw new Error(`Focuser for ${key} was not found`);
        }
        const prev = this.registry.prev(key);
        if (prev != null) {
            this.registry.setBefore(key, prev);
        }
    }
    /**
     * Overwrite focuser for `key`.
     * It throws if `key` does not exist.
     */
    // tslint:disable-next-line:no-reserved-keywords
    set(key, focuser) {
        const existingFocuser = this.focuserMap.get(key);
        if (existingFocuser == null) {
            throw new Error(`Key does not exist: ${key}`);
        }
        else {
            this.focuserMap.set(key, focuser);
        }
    }
    /**
     * Set the `key` of this registry from
     * the `parentRegistry`.
     */
    setParentRegistry(parentRegistryKey, parentRegistry) {
        this.parentRegistry = parentRegistry;
        this.parentRegistryKey = parentRegistryKey;
    }
    /**
     * Returns a string representation of this
     * and all nested registries.
     */
    toString() {
        return 'TabRegistry[\n' + this._toString(this.registry, '    ') + '\n' + ']';
    }
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function invariant(condition, format, a, b, c, d, e, f) {
  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    invariant_1(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var propTypes_1 = propTypes.object;
var propTypes_2 = propTypes.instanceOf;

function Tabbable(Comp) {
    return _a = class extends React.Component {
            constructor(props, context) {
                super(props, context);
                this.bindComponentRef = (ref) => {
                    this.refComponent = ref;
                    if (this.props.focus) {
                        this.focusTabble();
                    }
                };
                this.focusTabble = () => {
                    if (this.refComponent instanceof HTMLElement) {
                        this.refComponent.focus();
                        return true;
                    }
                    return false;
                };
                this.state = {
                    hasFocus: false,
                };
            }
            componentDidMount() {
                if (this.context != null && this.context.tabRegistry != null) {
                    this.context.tabRegistry.add(this.props.name, this.focusTabble);
                }
            }
            render() {
                return (React.createElement(Comp, Object.assign({}, this.props, this.state, { ref: this.bindComponentRef }), this.props.children));
            }
        }, _a.contextTypes = {
            tabRegistry: propTypes_2(TabRegistry),
        }, _a;
    var _a;
}
const Button = Tabbable('button');
const Input = Tabbable('input');
const Select = Tabbable('select');
const TextArea = Tabbable('textarea');

class TabBoundary extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onKeyDown = (e) => {
            if (e.key === 'Tab' && e.target != null && e.target.name != null) {
                const name = e.target.name;
                e.preventDefault();
                e.stopPropagation();
                if (e.shiftKey) {
                    this.tabRegistry.focusPrev(name);
                }
                else {
                    this.tabRegistry.focusNext(name);
                }
            }
        };
        this.tabRegistry = new TabRegistry({
            cycle: !!props.cycle,
        });
    }
    componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add(this.props.boundaryKey, this.tabRegistry);
        }
    }
    componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete(this.props.boundaryKey);
        }
    }
    getChildContext() {
        return {
            tabRegistry: this.tabRegistry,
        };
    }
    render() {
        return React.createElement("div", { onKeyDown: this.onKeyDown }, this.props.children);
    }
}
TabBoundary.childContextTypes = {
    tabRegistry: propTypes_2(TabRegistry),
};
TabBoundary.contextTypes = {
    tabRegistry: propTypes_2(TabRegistry),
};

class App extends React.Component {
    constructor() {
        super(...arguments);
        this.focusFirst = (e) => {
            // this is not the real implementation
            // but a quick hack to proof that the concept works.
            const comp = e._dispatchInstances._currentElement._owner;
            const context = comp._context;
            context.tabRegistry.parentRegistry.focusFirst();
        };
        this.preventDefault = (e) => e.preventDefault();
    }
    render() {
        return (
        // tslint:disable-next-line:jsx-no-lambda
        React.createElement("form", { onSubmit: this.preventDefault },
            React.createElement(TabBoundary, { cycle: true },
                React.createElement("label", { htmlFor: "username" }, "Username:"),
                React.createElement("div", null,
                    React.createElement(Input, { id: "username", name: "username" })),
                React.createElement("label", { htmlFor: "password" }, "Password:"),
                React.createElement("div", null,
                    React.createElement(Input, { id: "password", name: "password", type: "password" })),
                React.createElement("label", { htmlFor: "password-repeat" }, "Repeat password:"),
                React.createElement("div", null,
                    React.createElement(Input, { id: "password-repeat", name: "password-repeat", type: "password" })),
                React.createElement("label", { htmlFor: "gender" }, "Gender:"),
                React.createElement("div", null,
                    React.createElement(Select, { id: "gender", name: "gender" },
                        React.createElement("option", { value: "" }, ''),
                        React.createElement("option", { value: "female" }, "Female"),
                        React.createElement("option", { value: "male" }, "Male"))),
                React.createElement("label", { htmlFor: "submit" }, "Form controls"),
                React.createElement(TabBoundary, { boundaryKey: "controls" },
                    React.createElement(Input, { name: "reset", 
                        // tslint:disable-next-line:jsx-no-multiline-js jsx-no-lambda react-tsx-curly-spacing
                        onClick: this.focusFirst, type: "reset", value: "Reset" }),
                    React.createElement(Button, { id: "submit", name: "submit" }, "Submit")))));
    }
}
ReactDOM.render(React.createElement(App), document.querySelector('#root'));

}(React,ReactDOM));
