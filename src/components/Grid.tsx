import * as React from 'react';
import { createNavigationHandler, NavigationMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../util';
import { ArrowKey, ModifierKeys } from './Focuser';
import { NavigationContext, TabBoundary } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements = 'div'> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    children: (fn: (focusKey: string, arrowKey: ArrowKey, modifierKeys: ModifierKeys) => void) => JSX.Element;
    focusKey: string;
    navigationMap: NavigationMap;
}

type Props<TComp extends keyof JSX.IntrinsicElements = 'div'> = UnpackedHTMLAttributes<TComp> & ComponentProps<TComp>;

type PropsWithTabRegistry<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    tabRegistry: TabRegistry | null;
};

interface State {
    navigationHandler: (focusKey: string, arrowKey: ArrowKey, modifierKeys: ModifierKeys) => void;
}

export class GridWithTabRegistry<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithTabRegistry<TComp>,
    State
> {
    public constructor(props: PropsWithTabRegistry<TComp>) {
        super(props);
        this.state = {
            navigationHandler: createNavigationHandler(props.navigationMap, this.getTabRegistry),
        };
    }

    public componentWillReceiveProps(nextProps: PropsWithTabRegistry<TComp>) {
        if (this.props.navigationMap !== nextProps.navigationMap) {
            this.setState(_ => ({
                navigationHandler: createNavigationHandler(nextProps.navigationMap, this.getTabRegistry),
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

    private getTabRegistry = () => {
        if (this.props.tabRegistry == null) {
            throw new Error(`tabRegistry was not found on context of ${this.props.focusKey}`);
        }
        const tabRegistry = this.props.tabRegistry.get(this.props.focusKey);
        if (!(tabRegistry instanceof TabRegistry)) {
            throw new Error(`tabRegistry of ${this.props.focusKey} was not found`);
        }
        return tabRegistry;
    };

    public render() {
        const props = filterPropKeys<ComponentProps<TComp>, TComp, PropsWithTabRegistry<TComp>>(
            this.props,
            this.filterPropKeys,
        );

        return (
            <TabBoundary {...props} as={this.props.as} boundaryKey={this.props.focusKey}>
                {this.props.children(this.state.navigationHandler)}
            </TabBoundary>
        );
    }
}

type PropsWithForwardRef<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    forwardedRef?: React.Ref<GridWithTabRegistry<TComp>>;
};

class GridWithForwardRef<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithForwardRef<TComp>
> {
    public static displayName = 'TabRegistry(Grid)';

    private renderChildren = (tabRegistry: TabRegistry | null) => {
        const { forwardedRef, ...props } = this.props;
        return <GridWithTabRegistry {...props} tabRegistry={tabRegistry} />;
    };

    public render() {
        return <NavigationContext.Consumer children={this.renderChildren} />;
    }
}

const forwardRef = <TComp extends keyof JSX.IntrinsicElements = 'div'>() =>
    React.forwardRef<GridWithTabRegistry<TComp>, Props<TComp>>((props, ref) => (
        <GridWithForwardRef {...props} forwardedRef={ref} />
    ));

export type Grid = GridWithTabRegistry;
export const Grid = forwardRef<keyof JSX.IntrinsicElements>();
