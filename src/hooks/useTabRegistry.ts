import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { useContext } from 'react';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';

export function useTabRegistry(throwOnNull?: true): TabRegistry;
export function useTabRegistry(throwOnNull: false): TabRegistry | null;
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function useTabRegistry(throwOnNull: boolean = true): TabRegistry | null {
    const tabRegistry = useContext(NavigationContext);
    if (tabRegistry == null && throwOnNull !== false) {
        throw new Error('useTabRegistry must called from within a TabBoundary');
    }
    return tabRegistry;
}
