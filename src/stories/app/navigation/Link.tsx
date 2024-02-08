import { useFocusable, Hotkey, HotkeyBoundary } from '@zeroconf/keyboard-navigation';
import { useFocus } from '@zeroconf/keyboard-navigation/stories/utils/useFocus';
import { useLayoutEffect } from 'react';
import { twMerge } from 'tailwind-merge';

const meta = {
    title: 'App/Example',
};

export default meta;

interface LinkProps {
    readonly autoFocus?: boolean;
    readonly className?: string;
    readonly focusKey: string;
}

export const Link = (props: LinkProps) => {
    const { autoFocus, className, focusKey } = props;
    const { focus, ref } = useFocus<HTMLDivElement>();
    const focusableProps = useFocusable(focusKey, focus);

    useLayoutEffect(() => {
        if (autoFocus && ref.current != null) {
            if (focus()) {
                const event = new FocusEvent('focus', {
                    bubbles: true,
                    cancelable: false,
                    relatedTarget: ref.current,
                    target: ref.current,
                    view: window,
                } as any);
                (event as any).simulated = true;
                ref.current.dispatchEvent(event);
            }
        }
    }, [autoFocus, focus]);

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
        <HotkeyBoundary
            className={twMerge(
                'h-20 cursor-pointer border border-transparent border-b-black outline-none focus:border-red-500',
                className,
            )}
            crossLocalBoundary={true}
            {...focusableProps}
            ref={ref}
        >
            {focusKey}
            {special}
        </HotkeyBoundary>
    );
};

Link.story = {
    title: 'Link',
};
