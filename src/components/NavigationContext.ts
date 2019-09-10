import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import * as React from 'react';

export const NavigationContext = React.createContext<TabRegistry | null>(null);
