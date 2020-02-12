import { HotkeyRegistry } from '@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry';
import { createContext, useContext } from 'react';

const HotkeyContext = createContext<HotkeyRegistry | (() => HotkeyRegistry)>(() => HotkeyRegistry.global);

export const useHotkeyRegistry = ((calledFromHotkey?: boolean) => {
    // tslint:disable-next-line: react-hooks-nesting
    const context = useContext(HotkeyContext);
    if (typeof context === 'function') {
        if (calledFromHotkey) {
            throw new Error(
                'It appears that useHotkey/useHotkeys is called outside of a hotkey boundary, consider wrapping your application in a <GlobalHotkeyBoundary />',
            );
        }
        return context();
    } else {
        return context;
    }
}) as () => HotkeyRegistry;
export const HotkeyContextProvider = HotkeyContext.Provider as React.Provider<HotkeyRegistry>;
