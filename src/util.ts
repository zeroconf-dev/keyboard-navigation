import { ControlProps } from '@zeroconf/keyboard-navigation/hooks/components/Focuser';
import { HotkeyEvent } from '@zeroconf/keyboard-navigation/hotkeys/createHandler';
import { HotkeyObject } from '@zeroconf/keyboard-navigation';
import { WeakValidationMap } from 'react';

export const getTargetFocusKey = (obj: any): string | null => {
    /* istanbul ignore next */
    return typeof obj === 'object' && obj != null
        ? typeof obj.name === 'string' && obj.name !== ''
            ? obj.name
            : typeof obj.dataset === 'object'
            ? obj.dataset.focuskey || null
            : null
        : null;
};

/**
 * Helper for type-wise asserting that passing an object of type never
 * if however anything is passed to the function it will throw
 * with the message of `msg`.
 */
// tslint:disable-next-line:variable-name
export const assertNever = (_obj: never, msg: string): never => {
    /* istanbul ignore next */
    throw new Error(msg);
};

/**
 * Helper for type-wise asserting that passing an object
 * of type never, this is useful for exhausting union types,
 * but not throwing an error when called.
 */
export const assertNeverNonThrow = (obj: never): void => {
    return obj;
};

export type UnpackedHTMLElement<T> = T extends React.DetailedHTMLProps<React.HTMLAttributes<infer U>, infer U>
    ? U
    : HTMLElement;

export type UnpackedHTMLAttributes<TComp extends keyof JSX.IntrinsicElements> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
>;

export type HTMLType<T extends keyof JSX.IntrinsicElements> = UnpackedHTMLElement<JSX.IntrinsicElements[T]>;
export type ForwardRefProps<T, P> = React.PropsWithoutRef<P> & React.RefAttributes<T>;
export type ForwardRefComponent<P = {}, D extends Partial<P> = {}> = {
    readonly $$typeof: symbol;
    defaultProps: D;
    displayName?: string;
    propTypes?: WeakValidationMap<P>;
};

/**
 * Filtering componet props from DOM compatible props
 * of type `TComp`.
 */
export const filterPropKeys = <
    U extends {},
    TComp extends keyof JSX.IntrinsicElements,
    TProps extends UnpackedHTMLAttributes<TComp> & U
>(
    props: TProps,
    filterFn: (propKey: keyof U) => boolean,
): UnpackedHTMLAttributes<TComp> => {
    const propKeys = Object.keys(props) as (keyof TProps)[];
    return propKeys
        .filter((propKey: keyof TProps) => {
            return filterFn(propKey as keyof U);
        })
        .reduce((carry, propKey: keyof TProps) => {
            const intrinsicProp = propKey as keyof UnpackedHTMLAttributes<TComp>;
            carry[intrinsicProp] = props[intrinsicProp];
            return carry;
        }, {} as UnpackedHTMLAttributes<TComp>);
};

/**
 * Capture the control props, and return an object only containing those.
 */
export const spreadControlProps = <Props extends ControlProps>(props: Props): ControlProps => {
    return (Object.keys(props) as (keyof ControlProps)[])
        .filter(key => {
            /* istanbul ignore next */
            switch (key) {
                case 'autoFocus':
                case 'disabled':
                case 'onArrowDown':
                case 'onArrowKeys':
                case 'onArrowLeft':
                case 'onArrowRight':
                case 'onArrowUp':
                case 'onBlur':
                case 'onDelete':
                case 'onEnter':
                case 'onEscape':
                case 'onFocus':
                case 'onMinus':
                case 'onNavigationKeys':
                case 'onPlus':
                case 'onQuestionMark':
                case 'onSpace':
                    return true;
                default:
                    assertNeverNonThrow(key);
                    return false;
            }
        })
        .reduce((carry, item) => {
            (carry as any)[item] = props[item];
            return carry;
        }, {} as ControlProps);
};

/**
 * Test if element/event target is an element that can have focus
 * without setting tabIndex
 */
export const isNativeFocusable = (
    target: any,
): target is
    | HTMLAnchorElement
    | HTMLButtonElement
    | HTMLIFrameElement
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | { focus: () => void } => {
    return (
        target instanceof HTMLAnchorElement ||
        target instanceof HTMLButtonElement ||
        target instanceof HTMLIFrameElement ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement &&
            target.getAttribute('tabIndex') != null &&
            Number(target.getAttribute('tabIndex')) === -1) ||
        Number(target.getAttribute('tabIndex')) > 0
    );
};

/**
 * Test if an event target is a native input element.
 */
export const isNativeInput = (
    target: unknown,
): target is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement => {
    return (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.getAttribute('contenteditable') === 'true')
    );
};

export function isModifierMatching(hotkey: HotkeyObject, event: HotkeyEvent): boolean {
    if (hotkey.nonStrict) {
        return (
            (event.altKey || !hotkey.alt) &&
            (event.ctrlKey || !hotkey.ctrl) &&
            (event.metaKey || !hotkey.meta) &&
            (event.shiftKey || !hotkey.shift)
        );
    } else {
        return (
            Boolean(hotkey.alt) === event.altKey &&
            Boolean(hotkey.ctrl) === event.ctrlKey &&
            Boolean(hotkey.meta) === event.metaKey &&
            Boolean(hotkey.shift) === event.shiftKey
        );
    }
}

export function isKeyMatching(hotkey: HotkeyObject, event: HotkeyEvent): boolean {
    if (hotkey.nonStrict) {
        return hotkey.key == null || hotkey.key === (event.key.length === 1 ? event.key.toLowerCase() : event.key);
    } else {
        return (
            (hotkey.key == null && event.key.length !== 1) ||
            hotkey.key === (event.key.length === 1 ? event.key.toLowerCase() : event.key)
        );
    }
}

export const isSpecialKey = (event: HotkeyEvent): boolean => {
    return event.key.length !== 1;
};

export function isHotkeyMatching(hotkey: HotkeyObject, event: HotkeyEvent): boolean {
    return isModifierMatching(hotkey, event) && isKeyMatching(hotkey, event);
}

export const eventHasModifier = (event: HotkeyEvent): boolean => {
    return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
};

export const hotkeyHasModifier = (hotkey: HotkeyObject): boolean =>
    Boolean(hotkey.alt) ||
    Boolean(hotkey.cmd) ||
    Boolean(hotkey.ctrl) ||
    Boolean(hotkey.meta) ||
    Boolean(hotkey.mod) ||
    Boolean(hotkey.shift);

export const serializeHotkey = (hotkey: HotkeyObject): string => {
    // prettier-ignore
    return `${
        hotkey.alt ? 1 : 0}${
        hotkey.cmd ? 1 : 0}${
        hotkey.ctrl ? 1 : 0}${
        hotkey.meta ? 1 : 0}${
        hotkey.mod ? 1 : 0}${
        hotkey.nonStrict ? 1 : 0}${
        hotkey.shift ? 1 : 0}${
        hotkey.key == null ? '' : hotkey.key}`;
};

const arrowKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
export const isArrowKey = (hotkey: HotkeyObject): boolean => arrowKeys.has(String(hotkey.key));

export const mapIter = <T, R>(mapFn: (val: T, idx: number) => R) =>
    function*(iter: Generator<T>): Generator<R, void, void> {
        let idx = -1;
        for (const val of iter) {
            yield mapFn(val, ++idx);
        }
    };

export const filterIter = <T>(predicate: (val: T, idx: number, accepted: T[]) => boolean) =>
    function*(iter: Generator<T>): Generator<T, void, void> {
        const accepted: T[] = [];
        let idx = 0;
        for (const val of iter) {
            if (predicate(val, idx, accepted)) {
                yield val;
                accepted.push(val);
            }
            idx++;
        }
    };
