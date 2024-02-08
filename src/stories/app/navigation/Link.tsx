import { useFocusable, Hotkey, HotkeyBoundary } from '@zeroconf/keyboard-navigation';
import { useFocus } from '@zeroconf/keyboard-navigation/stories/utils/useFocus';
import { useLayoutEffect } from 'react';

const meta = {
    title: 'App/Example',
};

export default meta;

interface LinkProps {
    autoFocus?: boolean;
    className?: string;
    focusKey: string;
}

// css`
//     &:focus {
//         border-color: red;
//         border-bottom-color: red;
//     }
//     cursor: pointer;
//     border: 1px solid transparent;
//     border-bottom-color: black;
//     height: 50px;
//     outline: none;
// `
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
        <HotkeyBoundary crossLocalBoundary={true} className={className} {...focusableProps} ref={ref}>
            {focusKey}
            {special}
        </HotkeyBoundary>
    );
};

Link.story = {
    title: 'Link',
};
