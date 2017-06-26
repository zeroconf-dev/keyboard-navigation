import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TabRegistry } from 'TabRegistry';

export interface TabBoundryProps {
    boundryKey: string;
    cycle?: boolean;
}

export interface TabBoundryState {}

export interface ContextTypes {
    tabRegistry?: TabRegistry;
}

export class TabBoundry extends React.Component<TabBoundryProps, TabBoundryState> {
    public static childContextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };
    private tabRegistry: TabRegistry<any>;

    public context: ContextTypes | null | undefined;

    public constructor(props: TabBoundryProps, context?: ContextTypes) {
        super(props, context);
        this.tabRegistry = new TabRegistry({
            cycle: !!props.cycle,
        });
    }

    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add(this.props.boundryKey, this.tabRegistry);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete(this.props.boundryKey);
        }
    }

    private onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        return e;
    };

    public getChildContext() {
        return {
            tabRegistry: this.tabRegistry,
        };
    }

    public render() {
        return (
            <div onKeyDown={this.onKeyDown}>
                {this.props.children}
            </div>
        );
    }
}
