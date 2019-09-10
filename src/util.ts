import { ControlProps } from '@zeroconf/keyboard-navigation/components/Focuser';

/**
 * Helper for type-wise asserting that passing an object of type never
 * if however anything is passed to the function it will throw
 * with the message of `msg`.
 */
// tslint:disable-next-line:variable-name
export function assertNever(_obj: never, msg: string): never {
    /* istanbul ignore next */
    throw new Error(msg);
}

/**
 * Helper for type-wise asserting that passing an object
 * of type never, this is useful for exhausting union types,
 * but not throwing an error when called.
 */
export function assertNeverNonThrow(obj: never): never {
    return obj;
}

export type UnpackedHTMLElement<T> = T extends React.DetailedHTMLProps<React.HTMLAttributes<infer U>, infer U>
    ? U
    : HTMLElement;

export type UnpackedHTMLAttributes<TComp extends keyof JSX.IntrinsicElements> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
>;

/**
 * Filtering componet props from DOM compatible props
 * of type `TComp`.
 */
export function filterPropKeys<
    U extends {},
    TComp extends keyof JSX.IntrinsicElements,
    TProps extends UnpackedHTMLAttributes<TComp> & U
>(props: TProps, filterFn: (propKey: keyof U) => boolean): UnpackedHTMLAttributes<TComp> {
    const propKeys = Object.keys(props) as (keyof TProps)[];
    return propKeys
        .filter((propKey: keyof TProps) => {
            return filterFn(propKey as keyof U);
        })
        .reduce(
            (carry, propKey: keyof TProps) => {
                const intrinsicProp = propKey as keyof UnpackedHTMLAttributes<TComp>;
                carry[intrinsicProp] = props[intrinsicProp];
                return carry;
            },
            {} as UnpackedHTMLAttributes<TComp>,
        );
}

/**
 * Capture the control props, and return an object only containing those.
 */
export function spreadControlProps<Props extends ControlProps>(props: Props): ControlProps {
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
        .reduce(
            (carry, item) => {
                (carry as any)[item] = props[item];
                return carry;
            },
            {} as ControlProps,
        );
}

export function isNativeFocusable(target: any): boolean {
    return (
        target instanceof HTMLAnchorElement ||
        target instanceof HTMLAreaElement ||
        target instanceof HTMLButtonElement ||
        target instanceof HTMLIFrameElement ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement
    );
}
