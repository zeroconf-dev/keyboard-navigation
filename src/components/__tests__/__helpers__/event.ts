import { fireEvent } from 'react-testing-library';

export type AllEventKey =
    | '+'
    | '-'
    | 'ArrowUp'
    | 'ArrowDown'
    | 'ArrowLeft'
    | 'ArrowRight'
    | 'Tab'
    | ' '
    | 'Enter'
    | 'Escape'
    | 'Delete';

export const allNavigationEvents: { key: AllEventKey; shiftKey?: true }[] = [
    { key: '+' },
    { key: '-' },
    { key: 'ArrowUp' },
    { key: 'ArrowDown' },
    { key: 'ArrowLeft' },
    { key: 'ArrowRight' },
    { key: 'Tab' },
    { key: 'Tab', shiftKey: true },
    { key: ' ' },
    { key: 'Enter' },
    { key: 'Escape' },
    { key: 'Delete' },
];

export function plus(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: '+',
    });
}

export function minus(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: '-',
    });
}

export function tab(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'Tab',
    });
}

export function shiftTab(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'Tab',
        shiftKey: true,
    });
}

export function space(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: ' ',
    });
}

export function deleteKey(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'Delete',
    });
}

export function arrowUp(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'ArrowUp',
    });
}

export function arrowDown(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'ArrowDown',
    });
}

export function arrowLeft(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'ArrowLeft',
    });
}

export function arrowRight(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'ArrowRight',
    });
}

export function enter(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'Enter',
    });
}

export function escape(elm: HTMLElement) {
    return fireEvent.keyDown(elm, {
        key: 'Escape',
    });
}
