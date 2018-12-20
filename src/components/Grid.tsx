import * as React from 'react';
import { createNavigationHandler, NavigationMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../util';
import { NavigationKeyHandler } from './Focuser';
import { TabBoundary } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements = 'div'> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    children: (navigationHandler: NavigationKeyHandler) => JSX.Element;
    focusKey: string;
    navigationMap: NavigationMap;
}

type Props<TComp extends keyof JSX.IntrinsicElements = 'div'> = UnpackedHTMLAttributes<TComp> & ComponentProps<TComp>;

interface State {
    navigationHandler: NavigationKeyHandler;
}

export class Grid<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<Props<TComp>, State> {
    public static displayName = 'Grid';
    private tabRegistryRef: React.MutableRefObject<TabRegistry | null>;
    public constructor(props: Props<TComp>) {
        super(props);
        this.tabRegistryRef = React.createRef();
        this.state = {
            navigationHandler: createNavigationHandler(props.navigationMap, this.tabRegistryRef),
        };
    }

    public componentWillReceiveProps(nextProps: Props<TComp>) {
        if (this.props.navigationMap !== nextProps.navigationMap) {
            this.setState(_ => ({
                navigationHandler: createNavigationHandler(nextProps.navigationMap, this.tabRegistryRef),
            }));
        }
    }

    private filterPropKeys = (propKey: keyof ComponentProps<TComp> | 'tabRegistry') => {
        switch (propKey) {
            case 'as':
            case 'children':
            case 'navigationMap':
            case 'focusKey':
            case 'tabRegistry':
                return false;
            default:
                assertNeverNonThrow(propKey);
                return true;
        }
    };

    public render() {
        const props = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(this.props, this.filterPropKeys);

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
