import { useContext } from 'react';
import { NavigationContext } from '../components/TabBoundary';

export const useTabRegistry = () => useContext(NavigationContext);
