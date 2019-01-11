import * as React from 'react';
import { NavigationContext } from '../components/TabBoundary';

export const useTabRegistry = () => React.useContext(NavigationContext);
