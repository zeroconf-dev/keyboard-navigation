import { storiesOf } from '@storybook/react';
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import {
    Hotkey,
    HotkeyObject,
    HotkeyRegistry,
    TabBoundary,
    useFocusable,
    useHotkeyRegistry,
    HotkeyHandler,
} from '@zeroconf/keyboard-navigation';
import { css } from '@zeroconf/keyboard-navigation/stories/utils/css';
import { globalStyles } from '@zeroconf/keyboard-navigation/stories/utils/globalStyles';
import { hotkeyToText } from '@zeroconf/keyboard-navigation/hotkeys/components/__tests__/__helpers__/hotkeyToText';
import { serializeHotkey, isArrowKey, hotkeyHasModifier } from '@zeroconf/keyboard-navigation/util';
import { actions } from '@storybook/addon-actions';
import { NavigationMap } from '@zeroconf/keyboard-navigation/hotkeys/components/NavigationMap';
import { HotkeyBoundary } from '@zeroconf/keyboard-navigation/hotkeys/components';

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

    const special =
        focusKey === 'link3' ? (
            <Hotkey
                hotkey="3"
                handler={() => {
                    alert('Special key');
                    return true;
                }}
            />
        ) : null;

    return (
        <HotkeyBoundary crossLocalBoundary={true} className={className} {...focusableProps} ref={ref}>
            {focusKey}
            {special}
        </HotkeyBoundary>
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
                    : hotkey.key === 'Enter'
                    ? -88
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
    const outerMap = useMemo(
        () =>
            [
                // prettier-ignore
                ['link1'],
                ['link2'],
                ['link3'],
                ['link4'],
                ['link5'],
            ] as [string][],
        [],
    );
    const innerMap = useMemo(
        () =>
            [
                // prettier-ignore
                ['link4-1'],
                ['link4-2'],
                ['link4-3'],
                ['link4-4'],
            ] as [string][],
        [],
    );

    const navigationHandler: HotkeyHandler = useCallback(({ focusKey }) => {
        if (focusKey == null) {
            return false;
        }
        actionsMap.navigate(focusKey);
        return true;
    }, []);

    const focusPrev: HotkeyHandler = useCallback(({ focusKey, tabRegistry }) => {
        if (focusKey != null && tabRegistry != null && focusKey === tabRegistry.firstKey) {
            return tabRegistry.focusPrev(focusKey);
        }
        return false;
    }, []);

    const focusNext: HotkeyHandler = useCallback(({ focusKey, tabRegistry }) => {
        if (focusKey != null && tabRegistry != null && focusKey === tabRegistry.lastKey) {
            return tabRegistry.focusNext(focusKey);
        }
        return false;
    }, []);

    return (
        <>
            <Sidebar cycle={false} onKeyDown={stopPropagation}>
                <Link focusKey="link1" />
                <Link focusKey="link2" />
                <Link focusKey="link3" />
                <TabBoundary boundaryKey="link4" crossLocalBoundary={true}>
                    <Hotkey hotkey="arrowup" handler={focusPrev} />
                    <Hotkey hotkey="arrowdown" handler={focusNext} />
                    <Link focusKey="link4-1" />
                    <Link focusKey="link4-2" />
                    <Link focusKey="link4-3" />
                    <NavigationMap navigationMap={innerMap} tabDirectionAxis="y" />
                </TabBoundary>
                <Link focusKey="link5" />
                <Hotkey hotkey="enter" handler={navigationHandler} />
                <NavigationMap navigationMap={outerMap} tabDirectionAxis="y" />
                {globalStyles}
            </Sidebar>
            <HotkeyLegend renderHotkey={renderHotkey} mapFn={hotkeyMapper} />
        </>
    );
});

const Topbar = css`
    border: 1px solid black;
    display: flex;
    flex-direction: row;
    height: 50px;
`(TabBoundary);

const TopbarLink = css`
    display: flex;
    flex: 0 1 100px;
    flex-direction: column;
    align-self: center;
    justify-self: center;
    text-align: center;
    justify-content: center;
`(Link);

storiesOf('App/Navigation', module).add('Topbar', () => {
    const outerMap = useMemo(() => [['link1', 'link2', 'link3', 'link4']] as [string, string, string, string][], []);
    return (
        <>
            <Topbar>
                <TopbarLink focusKey="link1" />
                <TopbarLink focusKey="link2" />
                <TopbarLink focusKey="link3" />
                <TopbarLink focusKey="link4" />
                <NavigationMap navigationMap={outerMap} />
            </Topbar>
            <HotkeyLegend renderHotkey={renderHotkey} mapFn={hotkeyMapper} />
        </>
    );
});
