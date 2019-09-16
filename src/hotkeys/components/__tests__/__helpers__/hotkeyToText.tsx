import { HotKey } from '@zeroconf/keyboard-navigation/hotkeys/parser';
export const hotkeyToText = (hotkey: HotKey) => {
    const res = [] as string[];
    if (hotkey.cmd) {
        res.push('⌘');
    }
    if (hotkey.ctrl) {
        res.push('⌃');
    }
    if (hotkey.mod) {
        res.push('⌃');
    }
    if (hotkey.meta) {
        res.push('❖');
    }
    if (hotkey.alt) {
        res.push('⌥');
    }
    if (hotkey.shift) {
        res.push('⇧');
    }
    switch (true) {
        case hotkey.key === 'ArrowDown':
            res.push('▼');
            break;
        case hotkey.key === 'ArrowLeft':
            res.push('◀');
            break;
        case hotkey.key === 'ArrowRight':
            res.push('▶');
            break;
        case hotkey.key === 'ArrowUp':
            res.push('▲');
            break;
        case hotkey.key === 'Backspace':
            res.push('⌫');
            break;
        case hotkey.key === 'ContextMenu':
            res.push('☰');
            break;
        case hotkey.key === 'Delete':
            res.push('Del');
            break;
        case hotkey.key === 'End':
            res.push('End');
            break;
        case hotkey.key === 'Enter':
            res.push('⏎');
            break;
        case hotkey.key === 'Escape':
            res.push('Esc');
            break;
        case hotkey.key === 'Home':
            res.push('Home');
            break;
        case hotkey.key === 'Insert':
            res.push('Ins');
            break;
        case hotkey.key === 'PageDown':
            res.push('Page ▲');
            break;
        case hotkey.key === 'PageUp':
            res.push('Page ▼');
            break;
        case hotkey.key === 'Tab':
            res.push('↹');
            break;
        default:
            if (hotkey.key != null) {
                res.push(hotkey.key);
            }
            break;
    }
    return res.join(' + ');
};
