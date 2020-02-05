import { HotkeyContextProvider } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyContext';
import { useHotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkeyRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLElement } from '@zeroconf/keyboard-navigation/util';
import * as React from 'react';
import { useCallback, useEffect } from 'react';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
}
export type GlobalHotkeyBoundaryProps<TComp extends keyof JSX.IntrinsicElements = 'div'> = React.HTMLAttributes<
    UnpackedHTMLElement<JSX.IntrinsicElements[TComp]>
> &
    ComponentProps<TComp>;

const filterProps = <TComp extends keyof JSX.IntrinsicElements>(propKey: keyof ComponentProps<TComp>) => {
    switch (propKey) {
        case 'as':
            return false;
        default:
            assertNeverNonThrow(propKey);
            return true;
    }
};

export const GlobalHotkeyBoundary = <TComp extends keyof JSX.IntrinsicElements>(
    props: React.PropsWithChildren<GlobalHotkeyBoundaryProps<TComp>>,
) => {
    const registry = useHotkeyRegistry();

    if (registry !== registry.global) {
        throw new Error('The global hotkey boundary cannot be inside another hotkey boundary.');
    }

    useEffect(() => () => registry.dispose(), [registry]);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            registry.runCurrent(e);
        },
        [registry],
    );

    const comp = props.as == null ? 'div' : props.as;
    const childProps = filterPropKeys<ComponentProps<TComp>, TComp, GlobalHotkeyBoundaryProps<TComp>>(
        props,
        filterProps,
    );
    const children = React.createElement(comp, { ...childProps, onKeyDown }, props.children);

    return <HotkeyContextProvider value={registry}>{children}</HotkeyContextProvider>;
};
