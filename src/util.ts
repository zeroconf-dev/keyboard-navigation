// tslint:disable-next-line:variable-name
export function assertNever(_obj: never, msg: string): never {
    throw new Error(msg);
}

export function assertNeverNonThrow(obj: never): never {
    return obj;
}

export type UnpackedHTMLElement<T> = T extends React.DetailedHTMLProps<React.HTMLAttributes<infer U>, infer U>
    ? U
    : HTMLElement;

export type UnpackedHTMLAttributes<TComp extends keyof JSX.IntrinsicElements> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
>;

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
