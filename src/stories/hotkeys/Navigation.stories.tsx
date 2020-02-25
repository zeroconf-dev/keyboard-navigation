import { storiesOf } from '@storybook/react';
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import {
    Hotkey,
    HotkeyObject,
    HotkeyRegistry,
    TabBoundary,
    useFocusable,
    useNavigationMap,
    useHotkeyRegistry,
} from '@zeroconf/keyboard-navigation';
import { css } from '@zeroconf/keyboard-navigation/stories/utils/css';
import { globalStyles } from '@zeroconf/keyboard-navigation/stories/utils/globalStyles';
import { hotkeyToText } from '@zeroconf/keyboard-navigation/hotkeys/components/__tests__/__helpers__/hotkeyToText';
import { serializeHotkey, isArrowKey, hotkeyHasModifier } from '@zeroconf/keyboard-navigation/util';
import { actions } from '@storybook/addon-actions';

const Sidebar = css`
    border: 1px solid black;
    width: 300px;
`(TabBoundary);

const useFocus = <TElement extends HTMLElement>() => {
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

const actionsMap = actions({
    navigate: 'navigation fired',
});

const Link = css`
    &:focus {
        border-color: red;
        border-bottom-color: red;
    }
    height: 50px;
    border: 1px solid transparent;
    border-bottom-color: black;
    outline: none;
`((props: { className?: string; focusKey: string }) => {
    const { className, focusKey } = props;
    const { focus, ref } = useFocus<HTMLDivElement>();
    const focusableProps = useFocusable(focusKey, focus);
    return (
        <div className={className} {...focusableProps} ref={ref}>
            {focusKey}
        </div>
    );
});

const hotkeyStyles = {
    padding: 5,
};
const renderHotkey = (hotkey: HotkeyObject) => {
    const key = hotkeyToText(hotkey);
    return (
        <span key={key} style={hotkeyStyles}>
            {key}
        </span>
    );
};

const useForceRender = () => {
    const [, setUpdater] = useState(0);
    return useCallback(() => setUpdater(s => s + 1), []);
};

interface HotkeyLegendProps<T = HotkeyObject, R = HotkeyObject> {
    mapFn?: ((iter: Iterable<T>) => Iterable<R>) | null;
    renderHotkey: (hotkey: R) => JSX.Element;
}

const HotkeyLegend = (props: HotkeyLegendProps) => {
    const globalRegistry = useHotkeyRegistry().global;
    const [currentRegistry, setCurrentRegistry] = useState<HotkeyRegistry | null>(globalRegistry);
    const forceRender = useForceRender();
    useEffect(
        () =>
            globalRegistry.subscribe(reg => {
                setCurrentRegistry(reg);
                forceRender();
            }),
        [globalRegistry, forceRender],
    );

    const hotkeys =
        currentRegistry == null
            ? null
            : props.mapFn == null
            ? currentRegistry.iterHotkeys()
            : props.mapFn(currentRegistry.iterHotkeys());

    // prettier-ignore
    return (
        hotkeys == null
            ? null
            : <>{Array.from(hotkeys).map(hotkey => props.renderHotkey(hotkey))}</>
    );
};

interface HotkeyObjectExtended extends HotkeyObject {
    hashCode: string;
    sortFactor: number;
}

function hotkeyMapper(hotkeys: Iterable<HotkeyObject>): Iterable<HotkeyObjectExtended> {
    const generator = function*(iter: Iterable<HotkeyObject>): Generator<HotkeyObjectExtended, void, void> {
        const accepted: Set<string> = new Set();
        for (const hotkey of iter) {
            const hashCode = serializeHotkey(hotkey);
            if (accepted.has(hashCode)) {
                continue;
            }
            const hotkeyExtended: HotkeyObjectExtended = {
                ...hotkey,
                hashCode: hashCode,
                sortFactor: !hotkeyHasModifier(hotkey)
                    ? isArrowKey(hotkey)
                        ? hotkey.key === 'ArrowLeft'
                            ? -100
                            : hotkey.key === 'ArrowRight'
                            ? -99
                            : hotkey.key === 'ArrowUp'
                            ? -98
                            : hotkey.key === 'ArrowDown'
                            ? -97
                            : -91
                        : hotkey.key === 'Tab'
                        ? -90
                        : 0
                    : hotkey.key === 'Tab' && hotkey.shift
                    ? -89
                    : 0,
            };
            accepted.add(hotkeyExtended.hashCode);
            yield hotkeyExtended;
        }
    };

    return Array.from(generator(hotkeys)).sort((a, b) => {
        if (a.sortFactor > b.sortFactor) {
            return 1;
        } else if (a.sortFactor < b.sortFactor) {
            return -1;
        } else {
            return 0;
        }
    });
}

const stopPropagation: React.KeyboardEventHandler<HTMLElement> = e => {
    e.stopPropagation();
};

storiesOf('App/Navigation', module).add('Sidebar', () => {
    const navigationMapProps = useNavigationMap([
        // prettier-ignore
        ['link1'],
        ['link2'],
        ['link3'],
    ] as [string][]);

    const navigationHandler = useCallback((...args: any[]) => {
        const e = args[0] as any;
        const focusKey = (e.target as HTMLDivElement).dataset.focuskey;
        if (focusKey == null) {
            return false;
        }
        actionsMap.navigate(focusKey);
        return true;
    }, []);

    return (
        <Sidebar {...navigationMapProps} crossLocalBoundary={false} onKeyDown={stopPropagation}>
            {globalStyles}
            <Hotkey hotkey="enter" handler={navigationHandler} />
            <Link focusKey="link1" />
            <Link focusKey="link2" />
            <Link focusKey="link3" />
            <HotkeyLegend renderHotkey={renderHotkey} mapFn={hotkeyMapper} />
        </Sidebar>
    );
});
