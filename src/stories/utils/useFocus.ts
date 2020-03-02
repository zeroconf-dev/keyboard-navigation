import { useMemo, useRef } from 'react';

export const useFocus = <TElement extends HTMLElement>() => {
    const ref = useRef<TElement | null>(null);
    return {
        focus: useMemo(
            () => () => {
                if (ref.current == null) {
                    return false;
                }
                ref.current.focus();
                return true;
            },
            [],
        ),
        ref,
    };
};
