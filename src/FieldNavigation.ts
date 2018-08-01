import { ArrowKey } from './components/Focuser';
import { FocuserOptions, TabRegistry } from './TabRegistry';

type Maybe<T> = T | null;

export type FieldMap<T extends string | number> =
    | [Maybe<T>][]
    | [Maybe<T>, Maybe<T>][]
    | [Maybe<T>, Maybe<T>, Maybe<T>][]
    | [Maybe<T>, Maybe<T>, Maybe<T>, Maybe<T>][]
    | [Maybe<T>, Maybe<T>, Maybe<T>, Maybe<T>, Maybe<T>][];

type TabRegistryFetcher<T extends string | number> = () => TabRegistry<T> | null;

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

function findFieldCoordinates<T extends string | number>(
    fieldMap: FieldMap<T>,
    label: T,
    maxX: number,
    maxY: number,
): [number, number] | null {
    for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x <= maxX; x++) {
            if (label === fieldMap[y][x]) {
                return [x, y];
            }
        }
    }
    return null;
}

function focusDown<T extends string | number>(
    fieldMap: FieldMap<T>,
    getTabRegistry: TabRegistryFetcher<T>,
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

    if (nextField == null || !tabRegistry.focus(nextField, origin)) {
        return focusDown(fieldMap, getTabRegistry, x, yCandidate, maxX, maxY, origin);
    }
    return false;
}

function focusLeft<T extends string | number>(
    fieldMap: FieldMap<T>,
    getTabRegistry: TabRegistryFetcher<T>,
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

    if (nextField == null || !tabRegistry.focus(nextField, origin)) {
        return (
            focusUp(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
            focusDown(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
            focusLeft(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin)
        );
    }

    return true;
}

function focusRight<T extends string | number>(
    fieldMap: FieldMap<T>,
    getTabRegistry: TabRegistryFetcher<T>,
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

    if (nextField == null || !tabRegistry.focus(nextField, origin)) {
        return (
            focusUp(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
            focusDown(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
            focusRight(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin)
        );
    }

    return true;
}

function focusUp<T extends string | number>(
    fieldMap: FieldMap<T>,
    getTabRegistry: TabRegistryFetcher<T>,
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

    if (nextField == null || !tabRegistry.focus(nextField, origin)) {
        return focusUp(fieldMap, getTabRegistry, x, yCandidate, maxX, maxY, origin);
    }

    return false;
}

export function createNavigationHandler<T extends string | number>(
    fieldMap: FieldMap<T>,
    getTabRegistry: TabRegistryFetcher<T>,
): (label: T, arrowKey: ArrowKey) => void {
    const maxY = fieldMap.length - 1;
    const maxX = fieldMap[0].length - 1;
    return (label: T, arrowKey: ArrowKey) => {
        const coordinates = findFieldCoordinates(fieldMap, label, maxX, maxY);
        if (coordinates == null) {
            return;
        }

        const x = coordinates[0];
        const y = coordinates[1];

        switch (arrowKey) {
            case 'ArrowUp':
                return focusUp(fieldMap, getTabRegistry, x, y, maxX, maxY, originDown);
            case 'ArrowDown':
                return focusDown(fieldMap, getTabRegistry, x, y, maxX, maxY, originUp);
            case 'ArrowLeft':
                return focusLeft(fieldMap, getTabRegistry, x, y, maxX, maxY, originRight);
            case 'ArrowRight':
                return focusRight(fieldMap, getTabRegistry, x, y, maxX, maxY, originLeft);
            default:
                throw new Error(`Unknown arrowKey: ${arrowKey}`);
        }
    };
}
