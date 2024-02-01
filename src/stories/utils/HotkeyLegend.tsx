import { HotkeyObject, useHotkeyRegistry, HotkeyRegistry } from '@zeroconf/keyboard-navigation';
import React, { useState, useEffect } from 'react';
import { hotkeyToText } from '@zeroconf/keyboard-navigation/hotkeys/components/__tests__/helpers/hotkeyToText';
import { useForceRender } from '@zeroconf/keyboard-navigation/stories/utils/useForceRender';
import { serializeHotkey, hotkeyHasModifier, isArrowKey } from '@zeroconf/keyboard-navigation/util';

interface HotkeyObjectExtended extends HotkeyObject {
    hashCode: string;
    sortFactor: number;
}

const hotkeyStyles = {
    padding: 5,
};

export const renderHotkey = (hotkey: HotkeyObject) => {
    const key = hotkeyToText(hotkey);
    return (
        <span key={key} style={hotkeyStyles}>
            {key}
        </span>
    );
};

export function hotkeyMapper(hotkeys: Iterable<HotkeyObject>): Iterable<HotkeyObjectExtended> {
    const generator = function* (iter: Iterable<HotkeyObject>): Generator<HotkeyObjectExtended, void, void> {
        const accepted: Set<string> = new Set();
        for (const hotkey of iter) {
            const hashCode = serializeHotkey(hotkey);
            if (accepted.has(hashCode)) {
                continue;
            }
            const hotkeyExtended: HotkeyObjectExtended = {
                ...hotkey,
                hashCode: hashCode,
                sortFactor: !hotkeyHasModifier(hotkey)
                    ? isArrowKey(hotkey)
                        ? hotkey.key === 'ArrowLeft'
                            ? -100
                            : hotkey.key === 'ArrowRight'
                              ? -99
                              : hotkey.key === 'ArrowUp'
                                ? -98
                                : hotkey.key === 'ArrowDown'
                                  ? -97
                                  : -91
                        : hotkey.key === 'Tab'
                          ? -90
                          : 0
                    : hotkey.key === 'Tab' && hotkey.shift
                      ? -89
                      : hotkey.key === 'Enter'
                        ? -88
                        : 0,
            };
            accepted.add(hotkeyExtended.hashCode);
            yield hotkeyExtended;
        }
    };

    return Array.from(generator(hotkeys)).sort((a, b) => {
        if (a.sortFactor > b.sortFactor) {
            return 1;
        } else if (a.sortFactor < b.sortFactor) {
            return -1;
        } else {
            return 0;
        }
    });
}

interface HotkeyLegendBaseProps<T = HotkeyObject, R = HotkeyObject> {
    mapFn?: ((iter: Iterable<T>) => Iterable<R>) | null;
    renderHotkey: (hotkey: R) => JSX.Element;
}

export const HotkeyLegendBase = (props: HotkeyLegendBaseProps) => {
    const globalRegistry = useHotkeyRegistry().global;
    const [currentRegistry, setCurrentRegistry] = useState<HotkeyRegistry | null>(globalRegistry.currentLocalRegistry);
    const forceRender = useForceRender();

    useEffect(() => {
        if (currentRegistry !== globalRegistry.currentLocalRegistry) {
            setCurrentRegistry(globalRegistry.currentLocalRegistry);
            forceRender();
        }
        return globalRegistry.subscribe((reg) => {
            setCurrentRegistry(reg);
            forceRender();
        });
    }, [globalRegistry, currentRegistry, forceRender]);

    const hotkeys =
        currentRegistry == null
            ? null
            : props.mapFn == null
              ? currentRegistry.iterHotkeys()
              : props.mapFn(currentRegistry.iterHotkeys());

    // prettier-ignore
    return hotkeys == null ? null : <>{Array.from(hotkeys).map(hotkey => props.renderHotkey(hotkey))}</>;
};

export const HotkeyLegend = () => <HotkeyLegendBase renderHotkey={renderHotkey} mapFn={hotkeyMapper} />;
