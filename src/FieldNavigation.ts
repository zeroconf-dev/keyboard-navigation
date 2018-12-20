import { ModifierKeys, NavigationKey, NavigationKeyHandler } from './components/Focuser';
import { FocuserOptions, TabRegistry } from './TabRegistry';

type Maybe<T> = T | null;

export type NavigationMap =
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
    fieldMap: NavigationMap,
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
    fieldMap: NavigationMap,
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
    fieldMap: NavigationMap,
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
    fieldMap: NavigationMap,
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
    fieldMap: NavigationMap,
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

export function createNavigationHandler(
    navigationMap: NavigationMap,
    getTabRegistry: TabRegistryFetcher | React.RefObject<TabRegistry | null>,
    tabDirectionAxis: 'x' | 'y' = 'x',
): NavigationKeyHandler {
    const maxY = navigationMap.length - 1;
    const maxX = navigationMap[0].length - 1;

    const fetcher = typeof getTabRegistry === 'function' ? getTabRegistry : () => getTabRegistry.current;

    return (focusKey: string, navigationKey: NavigationKey, modifierKeys: ModifierKeys) => {
        if (
            modifierKeys.altKey ||
            modifierKeys.ctrlKey ||
            modifierKeys.metaKey ||
            (navigationKey !== 'Tab' && modifierKeys.shiftKey)
        ) {
            return; // don't act on modifier keys except when tabbing.
        }

        const coordinates = findFieldCoordinates(navigationMap, focusKey, maxX, maxY);
        if (coordinates == null) {
            return;
        }

        const x = coordinates[0];
        const y = coordinates[1];

        switch (navigationKey) {
            case 'ArrowUp':
                return focusUp(navigationMap, fetcher, x, y, maxX, maxY, originDown);
            case 'ArrowDown':
                return focusDown(navigationMap, fetcher, x, y, maxX, maxY, originUp);
            case 'ArrowLeft':
                return focusLeft(navigationMap, fetcher, x, y, maxX, maxY, originRight);
            case 'ArrowRight':
                return focusRight(navigationMap, fetcher, x, y, maxX, maxY, originLeft);
            case 'Tab':
                if (modifierKeys.shiftKey) {
                    return tabDirectionAxis === 'y'
                        ? focusUp(navigationMap, fetcher, x, y, maxX, maxY, originDown)
                        : focusLeft(navigationMap, fetcher, x, y, maxX, maxY, originRight);
                } else {
                    return tabDirectionAxis === 'y'
                        ? focusDown(navigationMap, fetcher, x, y, maxX, maxY, originUp)
                        : focusRight(navigationMap, fetcher, x, y, maxX, maxY, originLeft);
                }
            default:
                return false;
        }
    };
}
