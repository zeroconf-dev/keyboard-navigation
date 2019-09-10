import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import * as React from 'react';

export const useTabRegistry = () => React.useContext(NavigationContext);
