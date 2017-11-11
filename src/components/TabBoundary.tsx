import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { TabContextTypes } from './TabContext';

export interface TabBoundaryProps {
    boundaryKey?: string;
    cycle?: boolean;
}

export interface TabBoundaryState {}

export class TabBoundary extends React.Component<TabBoundaryProps, TabBoundaryState> {
    public static childContextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    public static contextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    private tabRegistry: TabRegistry<any>;

    public context: TabContextTypes | null | undefined;

    public constructor(props: TabBoundaryProps, context?: TabContextTypes) {
        super(props, context);
        this.tabRegistry = new TabRegistry({
            cycle: !!props.cycle,
        });
    }

    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add(this.props.boundaryKey, this.tabRegistry);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete(this.props.boundaryKey);
        }
    }

    private onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Tab' && e.target != null && (e.target as any).name != null) {
            const name = (e.target as any).name as string;
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                this.tabRegistry.focusPrev(name);
            } else {
                this.tabRegistry.focusNext(name);
            }
        }
    };

    public getChildContext() {
        return {
            tabRegistry: this.tabRegistry,
        };
    }

    public render() {
        return <div onKeyDown={this.onKeyDown}>{this.props.children}</div>;
    }
}
