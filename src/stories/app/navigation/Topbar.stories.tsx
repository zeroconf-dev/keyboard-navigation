import { storiesOf } from '@storybook/react';
import { NavigationMap, TabBoundary } from '@zeroconf/keyboard-navigation';
import { Link } from '@zeroconf/keyboard-navigation/stories/app/navigation/Link';
import { css } from '@zeroconf/keyboard-navigation/stories/utils/css';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/stories/utils/HotkeyLegend';
import React, { useMemo } from 'react';
import { NavigationFieldMap } from '@zeroconf/keyboard-navigation/FieldNavigation';

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
    const outerMap: NavigationFieldMap = useMemo(() => [['link1', 'link2', 'link3', 'link4']], []);
    return (
        <>
            <Topbar cycle={true}>
                <TopbarLink autoFocus={true} focusKey="link1" />
                <TopbarLink focusKey="link2" />
                <TopbarLink focusKey="link3" />
                <TopbarLink focusKey="link4" />
                <NavigationMap navigationMap={outerMap} />
            </Topbar>
            <HotkeyLegend />
        </>
    );
});
