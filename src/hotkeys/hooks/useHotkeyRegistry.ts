import { HotkeyContext } from '@zeroconf/keyboard-navigation/hotkeys/components/HotkeyContext';
import { useContext } from 'react';

export const useHotkeyRegistry = () => useContext(HotkeyContext);
