import * as React from 'react';
import { createNavigationHandler, FieldMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../util';
import { ArrowKey } from './Focuser';
import { NavigationContext, TabBoundary } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    children: (fn: (focusKey: TKey, arrowKey: ArrowKey) => void) => JSX.Element;
    fieldMap: FieldMap<TKey>;
    focusKey: TKey;
}

type Props<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> = UnpackedHTMLAttributes<TComp> &
    ComponentProps<TComp, TKey>;

interface State<TKey extends number | string> {
    navigationHandler: (focusKey: TKey, arrowKey: ArrowKey) => void;
}

export class Grid<
    TComp extends keyof JSX.IntrinsicElements = 'div',
    TKey extends number | string = string
> extends React.Component<Props<TComp, TKey>, State<TKey>> {
    private tabRegistry: TabRegistry<TKey> | null = null;
    public constructor(props: Props<TComp, TKey>) {
        super(props);
        this.state = {
            navigationHandler: createNavigationHandler(props.fieldMap, this.getTabRegistry),
        };
    }

    public componentWillReceiveProps(nextProps: Props<TComp, TKey>) {
        if (this.props.fieldMap !== nextProps.fieldMap) {
            this.setState(_ => ({
                navigationHandler: createNavigationHandler(nextProps.fieldMap, this.getTabRegistry),
            }));
        }
    }

    private filterPropKeys = (propKey: keyof ComponentProps<TComp, TKey>) => {
        switch (propKey) {
            case 'as':
            case 'children':
            case 'fieldMap':
            case 'focusKey':
                return false;
            default:
                assertNeverNonThrow(propKey);
                return true;
        }
    };

    private getTabRegistry = () => {
        if (this.tabRegistry == null) {
            throw new Error(`tabRegistry was not found on context of ${this.props.focusKey}`);
        }
        const tabRegistry = this.tabRegistry.get(this.props.focusKey);
        if (!(tabRegistry instanceof TabRegistry)) {
            throw new Error(`tabRegistry of ${this.props.focusKey} was not found`);
        }
        return tabRegistry;
    };

    public render() {
        const props = filterPropKeys<ComponentProps<TComp, TKey>, TComp, Props<TComp, TKey>>(
            this.props,
            this.filterPropKeys,
        );
        return (
            <NavigationContext.Consumer>
                {tabRegistry => {
                    this.tabRegistry = tabRegistry;
                    return (
                        <TabBoundary {...props} as={this.props.as} boundaryKey={this.props.focusKey}>
                            {this.props.children(this.state.navigationHandler)}
                        </TabBoundary>
                    );
                }}
            </NavigationContext.Consumer>
        );
    }
}
