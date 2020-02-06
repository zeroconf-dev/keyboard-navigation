import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { createContext, useContext } from 'react';

const HotkeyContext = createContext<HotkeyRegistry | (() => HotkeyRegistry)>(() => HotkeyRegistry.global);

export const useHotkeyRegistry = () => {
    const context = useContext(HotkeyContext);
    return typeof context === 'function' ? context() : context;
};
export const HotkeyContextProvider = HotkeyContext.Provider as React.Provider<HotkeyRegistry>;
