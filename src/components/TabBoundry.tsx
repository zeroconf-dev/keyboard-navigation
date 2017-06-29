import { TabContextTypes } from 'components/TabContext';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TabRegistry } from 'TabRegistry';

export interface TabBoundryProps {
    boundryKey: string;
    cycle?: boolean;
}

export interface TabBoundryState {}

export class TabBoundry extends React.Component<TabBoundryProps, TabBoundryState> {
    public static childContextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    public static contextTypes = {
        tabRegistry: PropTypes.instanceOf(TabBoundry),
    };

    private tabRegistry: TabRegistry<any>;

    public context: TabContextTypes | null | undefined;

    public constructor(props: TabBoundryProps, context?: TabContextTypes) {
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
        return (
            <div onKeyDown={this.onKeyDown}>
                {this.props.children}
            </div>
        );
    }
}
