import React from 'react';
import { createNavigationHandler, NavigationMap } from '../../FieldNavigation';
import { TabRegistry } from '../../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../../util';
import { NavigationKeyHandler } from './Focuser';
import { TabBoundary } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements = 'div'> {
    /**
     * Specify which intrinsic / host component the section should be rendered as.
     */
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;

    /**
     * Render prop with a navigation handler created from the
     * navigation map and tab direction axis configuration.
     */
    children: (navigationHandler: NavigationKeyHandler) => JSX.Element;

    /**
     * The focus key to identify the section inside the closed ancestor boundary.
     * **Note**: it should be unique amongst its siblings of the bonudary it lives in.
     */
    focusKey: string;

    /**
     * A matrix of how the focusable elements are layed out.
     *
     * If some elements take up 2 elements of space, just
     * put the same key multiple places.
     *
     * @example
     * [['elm1', 'elm2', 'elm3'],
     *  ['elm4', null, 'elm3']]
     */
    navigationMap: NavigationMap;

    /**
     * Set the tab direction of the
     * navigation map.
     */
    tabDirectionAxis?: 'x' | 'y';
}

export type Props<TComp extends keyof JSX.IntrinsicElements = 'div'> = UnpackedHTMLAttributes<TComp> &
    ComponentProps<TComp>;

function filterProps<TComp extends keyof JSX.IntrinsicElements>(propKey: keyof ComponentProps<TComp>) {
    switch (propKey) {
        case 'as':
        case 'children':
        case 'navigationMap':
        case 'focusKey':
        case 'tabDirectionAxis':
            return false;
        default:
            /* istanbul ignore next */
            assertNeverNonThrow(propKey);
            /* istanbul ignore next */
            return true;
    }
}

export const Grid = <TComp extends keyof JSX.IntrinsicElements>(props: Props<TComp>) => {
    const boundaryProps = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(props, filterProps);
    const tabRegistryRef = React.useRef<TabRegistry<string>>(null);
    const tabDirectionAxis = props.tabDirectionAxis == null ? 'x' : props.tabDirectionAxis;

    const navigationHandler = React.useMemo(
        () => createNavigationHandler(props.navigationMap, tabRegistryRef, tabDirectionAxis),
        [props.navigationMap, tabRegistryRef, tabDirectionAxis],
    );

    return (
        <TabBoundary {...boundaryProps} as={props.as} boundaryKey={props.focusKey} tabRegistryRef={tabRegistryRef}>
            {props.children(navigationHandler)}
        </TabBoundary>
    );
};
