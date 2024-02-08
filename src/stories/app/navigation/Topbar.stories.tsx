import { NavigationMap, TabBoundary } from '@zeroconf/keyboard-navigation';
import { Link } from '@zeroconf/keyboard-navigation/stories/app/navigation/Link';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/stories/utils/HotkeyLegend';
import { useMemo } from 'react';
import { NavigationFieldMap } from '@zeroconf/keyboard-navigation/FieldNavigation';

const TopbarLink = ({ className, ...props }: PropsFor<typeof Link>) => (
    <Link
        className={`items-center flex flex-initial self-center justify-center flex-col basis-24 ${className ?? ''}`}
        {...props}
    />
);
export default {
    title: 'App/Navigation',
};

export const _Topbar = () => {
    const outerMap: NavigationFieldMap = useMemo(() => [['link1', 'link2', 'link3', 'link4']], []);
    return (
        <>
            <TabBoundary className="border flex h-12" cycle={true}>
                <TopbarLink autoFocus={true} focusKey="link1" />
                <TopbarLink focusKey="link2" />
                <TopbarLink focusKey="link3" />
                <TopbarLink focusKey="link4" />
                <NavigationMap navigationMap={outerMap} />
            </TabBoundary>
            <HotkeyLegend />
        </>
    );
};
