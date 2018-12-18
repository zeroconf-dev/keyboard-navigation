import * as React from 'react';
import { createNavigationHandler, FieldMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../util';
import { ArrowKey, ModifierKeys } from './Focuser';
import { NavigationContext, TabBoundary } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    children: (fn: (focusKey: string, arrowKey: ArrowKey, modifierKeys: ModifierKeys) => void) => JSX.Element;
    fieldMap: FieldMap;
    focusKey: string;
}

type Props<TComp extends keyof JSX.IntrinsicElements> = UnpackedHTMLAttributes<TComp> & ComponentProps<TComp>;

interface State {
    navigationHandler: (focusKey: string, arrowKey: ArrowKey, modifierKeys: ModifierKeys) => void;
}

export class Grid<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<Props<TComp>, State> {
    private tabRegistry: TabRegistry<string> | null = null;
    public constructor(props: Props<TComp>) {
        super(props);
        this.state = {
            navigationHandler: createNavigationHandler(props.fieldMap, this.getTabRegistry),
        };
    }

    public componentWillReceiveProps(nextProps: Props<TComp>) {
        if (this.props.fieldMap !== nextProps.fieldMap) {
            this.setState(_ => ({
                navigationHandler: createNavigationHandler(nextProps.fieldMap, this.getTabRegistry),
            }));
        }
    }

    private filterPropKeys = (propKey: keyof ComponentProps<TComp>) => {
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

    private renderWithTabRegistry = (tabRegistry: TabRegistry<string> | null) => {
        const props = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(this.props, this.filterPropKeys);
        this.tabRegistry = tabRegistry;
        return (
            <TabBoundary {...props} as={this.props.as} boundaryKey={this.props.focusKey}>
                {this.props.children(this.state.navigationHandler)}
            </TabBoundary>
        );
    };

    public render() {
        return <NavigationContext.Consumer>{this.renderWithTabRegistry}</NavigationContext.Consumer>;
    }
}
