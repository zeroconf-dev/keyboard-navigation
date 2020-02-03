import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { createContext } from 'react';

export const HotkeyContext = createContext(HotkeyRegistry.global);
export const HotkeyContextProvider = HotkeyContext.Provider;
