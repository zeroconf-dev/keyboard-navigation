import { NavigationMap, TabBoundary } from '@zeroconf/keyboard-navigation';
import { Link } from '@zeroconf/keyboard-navigation/stories/app/navigation/Link';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/stories/utils/HotkeyLegend';
import { NavigationFieldMap } from '@zeroconf/keyboard-navigation/FieldNavigation';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

const TopbarLink = ({ className, ...props }: PropsFor<typeof Link>) => (
    <Link
        className={twMerge(
            'flex h-12 flex-initial basis-24 flex-col items-center justify-center self-center',
            className,
        )}
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
            <TabBoundary className="flex h-12 border" cycle={true}>
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
