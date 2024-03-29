import { storiesOf } from '@storybook/react';
import React, { useMemo, useCallback } from 'react';
import { Hotkey, TabBoundary, HotkeyHandler } from '@zeroconf/keyboard-navigation';
import { css } from '@zeroconf/keyboard-navigation/stories/utils/css';
import { globalStyles } from '@zeroconf/keyboard-navigation/stories/utils/globalStyles';
import { actions } from '@storybook/addon-actions';
import { NavigationMap } from '@zeroconf/keyboard-navigation/hotkeys/components/NavigationMap';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/stories/utils/HotkeyLegend';
import { Link } from '@zeroconf/keyboard-navigation/stories/app/navigation/Link';

const Sidebar = css`
    border: 1px solid black;
    width: 300px;
`(TabBoundary);

const SidebarLink = css`
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    padding: 1rem;
`(Link);

const actionsMap = actions({
    navigate: 'navigation fired',
});

const stopPropagation: React.KeyboardEventHandler<HTMLElement> = (e) => {
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
                <SidebarLink autoFocus={true} focusKey="link1" />
                <SidebarLink focusKey="link2" />
                <SidebarLink focusKey="link3" />
                <TabBoundary boundaryKey="link4" crossLocalBoundary={true}>
                    <Hotkey hotkey="arrowup" handler={focusPrev} />
                    <Hotkey hotkey="arrowdown" handler={focusNext} />
                    <SidebarLink focusKey="link4-1" />
                    <SidebarLink focusKey="link4-2" />
                    <SidebarLink focusKey="link4-3" />
                    <NavigationMap navigationMap={innerMap} tabDirectionAxis="y" />
                </TabBoundary>
                <SidebarLink focusKey="link5" />
                <Hotkey hotkey="enter" handler={navigationHandler} />
                <NavigationMap navigationMap={outerMap} tabDirectionAxis="y" />
                {globalStyles}
            </Sidebar>
            <HotkeyLegend />
        </>
    );
});
