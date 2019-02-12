import React from 'react';
import { NavigationContext } from '../components/NavigationContext';

export const useTabRegistry = () => React.useContext(NavigationContext);
