import { useHotkey } from '@zeroconf/keyboard-navigation/hotkeys/hooks/useHotkey';
import { HotkeyHandler } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';

interface HotkeyProps {
    hotkey: string;
    handler: HotkeyHandler;
    isGlobal?: boolean;
}

export const Hotkey: React.FC<HotkeyProps> = (props: HotkeyProps) => {
    useHotkey(props.hotkey, props.handler, props.isGlobal);
    return null;
};

Hotkey.displayName = 'Hotkey';

Hotkey.defaultProps = {
    isGlobal: false,
};
