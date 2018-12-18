import { NavigationKey, NavigationKeyHandler } from './components/Focuser';
import { FocuserOptions, TabRegistry } from './TabRegistry';

type Maybe<T> = T | null;

export type FieldMap =
    | [Maybe<string>][]
    | [Maybe<string>, Maybe<string>][]
    | [Maybe<string>, Maybe<string>, Maybe<string>][]
    | [Maybe<string>, Maybe<string>, Maybe<string>, Maybe<string>][]
    | [Maybe<string>, Maybe<string>, Maybe<string>, Maybe<string>, Maybe<string>][];

type TabRegistryFetcher = () => TabRegistry<string> | null;

const originUp: FocuserOptions = {
    focusOrigin: 'up',
};

const originDown: FocuserOptions = {
    focusOrigin: 'down',
};

const originLeft: FocuserOptions = {
    focusOrigin: 'left',
};

const originRight: FocuserOptions = {
    focusOrigin: 'right',
};

function findFieldCoordinates(
    fieldMap: FieldMap,
    focusKey: string,
    maxX: number,
    maxY: number,
): [number, number] | null {
    for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x <= maxX; x++) {
            if (focusKey === fieldMap[y][x]) {
                return [x, y];
            }
        }
    }
    return null;
}

function focusDown(
    fieldMap: FieldMap,
    getTabRegistry: TabRegistryFetcher,
    x: number,
    y: number,
    maxX: number,
    maxY: number,
    origin: FocuserOptions,
): boolean {
    const tabRegistry = getTabRegistry();
    if (y === maxY || tabRegistry == null) {
        return false;
    }

    const yCandidate = y + 1;
    const nextField = fieldMap[yCandidate][x];

    return (
        (nextField != null && tabRegistry.focus(nextField, origin)) ||
        focusDown(fieldMap, getTabRegistry, x, yCandidate, maxX, maxY, origin)
    );
}

function focusLeft(
    fieldMap: FieldMap,
    getTabRegistry: TabRegistryFetcher,
    x: number,
    y: number,
    maxX: number,
    maxY: number,
    origin: FocuserOptions,
): boolean {
    const tabRegistry = getTabRegistry();
    if (x === 0 || tabRegistry == null) {
        return false;
    }

    const xCandidate = x - 1;
    const nextField = fieldMap[y][xCandidate];

    return (
        (nextField != null && tabRegistry.focus(nextField, origin)) ||
        focusUp(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
        focusDown(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
        focusLeft(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin)
    );
}

function focusRight(
    fieldMap: FieldMap,
    getTabRegistry: TabRegistryFetcher,
    x: number,
    y: number,
    maxX: number,
    maxY: number,
    origin: FocuserOptions,
): boolean {
    const tabRegistry = getTabRegistry();
    if (x === maxX || tabRegistry == null) {
        return false;
    }

    const xCandidate = x + 1;
    const nextField = fieldMap[y][xCandidate];

    return (
        (nextField != null && tabRegistry.focus(nextField, origin)) ||
        focusUp(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
        focusDown(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
        focusRight(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin)
    );
}

function focusUp(
    fieldMap: FieldMap,
    getTabRegistry: TabRegistryFetcher,
    x: number,
    y: number,
    maxX: number,
    maxY: number,
    origin: FocuserOptions,
): boolean {
    const tabRegistry = getTabRegistry();
    if (y === 0 || tabRegistry == null) {
        return false;
    }

    const yCandidate = y - 1;
    const nextField = fieldMap[yCandidate][x];

    return (
        (nextField != null && tabRegistry.focus(nextField, origin)) ||
        focusUp(fieldMap, getTabRegistry, x, yCandidate, maxX, maxY, origin)
    );
}

export function createNavigationHandler(fieldMap: FieldMap, getTabRegistry: TabRegistryFetcher): NavigationKeyHandler {
    const maxY = fieldMap.length - 1;
    const maxX = fieldMap[0].length - 1;
    return (focusKey: string, navigationKey: NavigationKey) => {
        const coordinates = findFieldCoordinates(fieldMap, focusKey, maxX, maxY);
        if (coordinates == null) {
            return;
        }

        const x = coordinates[0];
        const y = coordinates[1];

        switch (navigationKey) {
            case 'ArrowUp':
                return focusUp(fieldMap, getTabRegistry, x, y, maxX, maxY, originDown);
            case 'ArrowDown':
                return focusDown(fieldMap, getTabRegistry, x, y, maxX, maxY, originUp);
            case 'ArrowLeft':
                return focusLeft(fieldMap, getTabRegistry, x, y, maxX, maxY, originRight);
            case 'ArrowRight':
                return focusRight(fieldMap, getTabRegistry, x, y, maxX, maxY, originLeft);
            default:
                return false;
        }
    };
}
