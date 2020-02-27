import { useNavigationMap } from '@zeroconf/keyboard-navigation/hooks/useNavigationMap';
import { NavigationFieldMap } from '@zeroconf/keyboard-navigation/FieldNavigation';

interface NavigationMapProps {
    navigationMap: NavigationFieldMap;
    tabDirectionAxis?: 'x' | 'y';
}
export const NavigationMap = (props: NavigationMapProps) => {
    useNavigationMap(props.navigationMap, props.tabDirectionAxis);
    return null;
};
