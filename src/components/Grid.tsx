import * as React from 'react';
import { createNavigationHandler, FieldMap } from '../FieldNavigation';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../util';
import { ArrowKey } from './Focuser';
import { TabBoundary, TabBoundaryContext } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> {
    children: (fn: (focusKey: TKey, arrowKey: ArrowKey) => void) => JSX.Element;
    component?: TComp;
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
    public static contextTypes = TabBoundary.childContextTypes;
    public context: TabBoundaryContext<TKey> | undefined;

    public constructor(props: Props<TComp, TKey>, context: TabBoundaryContext<TKey>) {
        super(props, context);
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
            case 'children':
            case 'component':
            case 'fieldMap':
            case 'focusKey':
                return false;
            default:
                assertNeverNonThrow(propKey);
                return true;
        }
    };

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
        const props = filterPropKeys<ComponentProps<TComp, TKey>, TComp, Props<TComp, TKey>>(
            this.props,
            this.filterPropKeys,
        );
        return (
            <TabBoundary {...props} boundaryKey={this.props.focusKey} component={this.props.component}>
                {this.props.children(this.state.navigationHandler)}
            </TabBoundary>
        );
    }
}
