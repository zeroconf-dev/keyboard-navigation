import { NavigationKeyHandler } from '@zeroconf/keyboard-navigation/components/Focuser';
import { TabBoundary } from '@zeroconf/keyboard-navigation/components/TabBoundary';
import { createNavigationHandler, NavigationFieldMap } from '@zeroconf/keyboard-navigation/FieldNavigation';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '@zeroconf/keyboard-navigation/util';
import * as React from 'react';

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
    navigationMap: NavigationFieldMap;

    /**
     * Set the tab direction of the
     * navigation map.
     */
    tabDirectionAxis?: 'x' | 'y';
}

export type Props<TComp extends keyof JSX.IntrinsicElements = 'div'> = Omit<UnpackedHTMLAttributes<TComp>, 'children'> &
    ComponentProps<TComp>;

interface State {
    navigationHandler: NavigationKeyHandler;
}

/**
 * Layout component with a fixed setup of the focusable elements.
 * To give the user an intuitive experience of navigating between
 * the focusable elements in grid.
 */
export class Grid<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<Props<TComp>, State> {
    public static defaultProps = {
        tabDirectionAxis: 'x',
    };

    public static displayName = 'Grid';
    private tabRegistryRef: React.RefObject<TabRegistry>;
    public constructor(props: Props<TComp>) {
        super(props);
        this.tabRegistryRef = React.createRef();
        this.state = {
            navigationHandler: createNavigationHandler(
                props.navigationMap,
                this.tabRegistryRef,
                props.tabDirectionAxis,
            ),
        };
    }

    private filterPropKeys = (propKey: keyof ComponentProps<TComp> | 'tabRegistry') => {
        /* istanbul ignore next */
        switch (propKey) {
            case 'as':
            case 'children':
            case 'navigationMap':
            case 'focusKey':
            case 'tabDirectionAxis':
            case 'tabRegistry':
                return false;
            default:
                /* istanbul ignore next */
                assertNeverNonThrow(propKey);
                /* istanbul ignore next */
                return true;
        }
    };

    public UNSAFE_componentWillReceiveProps(nextProps: Props<TComp>) {
        if (this.props.navigationMap !== nextProps.navigationMap) {
            /* istanbul ignore next */
            this.setState({
                navigationHandler: createNavigationHandler(nextProps.navigationMap, this.tabRegistryRef),
            });
        }
    }

    public render() {
        const props = filterPropKeys<Omit<ComponentProps<TComp>, 'children'>, TComp, Omit<Props<TComp>, 'children'>>(
            this.props,
            this.filterPropKeys,
        );

        return (
            <TabBoundary
                {...props}
                as={this.props.as}
                boundaryKey={this.props.focusKey}
                tabRegistryRef={this.tabRegistryRef}
            >
                {this.props.children(this.state.navigationHandler)}
            </TabBoundary>
        );
    }
}
