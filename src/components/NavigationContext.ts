import React from 'react';
import { TabRegistry } from '../TabRegistry';

export const NavigationContext = React.createContext<TabRegistry | null>(null);
