import * as React from 'react';
import { createNavigationHandler, FieldMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';
import { ArrowKey } from './Focuser';
import { TabBoundary, TabBoundaryContext } from './TabBoundary';

interface Props<TKey extends number | string> {
    children: (fn: (focusKey: TKey, arrowKey: ArrowKey) => void) => JSX.Element;
    fieldMap: FieldMap<TKey>;
    focusKey: TKey;
}

interface State<TKey extends number | string> {
    navigationHandler: (focusKey: TKey, arrowKey: ArrowKey) => void;
}

export class Grid<TKey extends number | string = string> extends React.Component<Props<TKey>, State<TKey>> {
    public static contextTypes = TabBoundary.childContextTypes;
    public context: TabBoundaryContext<TKey> | undefined;

    public constructor(props: Props<TKey>, context: TabBoundaryContext<TKey>) {
        super(props, context);
        this.state = {
            navigationHandler: createNavigationHandler(props.fieldMap, this.getTabRegistry),
        };
    }

    public componentWillReceiveProps(nextProps: Props<TKey>) {
        if (this.props.fieldMap !== nextProps.fieldMap) {
            this.setState(_ => ({
                navigationHandler: createNavigationHandler(nextProps.fieldMap, this.getTabRegistry),
            }));
        }
    }

    private getTabRegistry = () => {
        if (this.context == null || this.context.tabRegistry == null) {
            throw new Error(`tabRegistry was not found on context of ${this.props.focusKey}`);
        }
        const tabRegistry = this.context.tabRegistry.get(this.props.focusKey);
        if (!(tabRegistry instanceof TabRegistry)) {
            throw new Error(`tabRegistry of ${this.props.focusKey} was not found`);
        }
        return tabRegistry;
    };

    public render() {
        return (
            <TabBoundary boundaryKey={this.props.focusKey}>
                {this.props.children(this.state.navigationHandler)}
            </TabBoundary>
        );
    }
}
