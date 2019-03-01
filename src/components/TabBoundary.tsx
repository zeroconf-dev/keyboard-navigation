import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { TabContextTypes } from './TabContext';

export interface TabBoundaryProps<TComp extends keyof JSX.IntrinsicElements = 'div'> {
    boundaryKey?: string;
    component?: TComp;
    componentProps?: JSX.IntrinsicElements[TComp];
    cycle?: boolean;
    focusParentOnChildOrigin?: boolean;
    focusParentOnEscape?: boolean;
}

export interface TabBoundaryState {}

export class TabBoundary<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    TabBoundaryProps<TComp>,
    TabBoundaryState
> {
    public static childContextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    public static contextTypes = {
        tabRegistry: PropTypes.instanceOf(TabRegistry),
    };

    private tabRegistry: TabRegistry<any>;

    public context: TabContextTypes | null | undefined;

    public constructor(props: TabBoundaryProps<TComp>, context: TabContextTypes) {
        super(props, context);
        this.tabRegistry = new TabRegistry({
            cycle: props.cycle,
            focusParentOnChildOrigin: props.focusParentOnChildOrigin,
        });
    }

    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null && this.props.boundaryKey! + null) {
            this.context.tabRegistry.add(this.props.boundaryKey, this.tabRegistry);
        }
    }

    public componentWillReceiveProps(nextProps: TabBoundaryProps<TComp>, nextContext: TabContextTypes) {
        if (
            ((nextContext == null || nextContext.tabRegistry == null) &&
                (this.context != null && this.context.tabRegistry != null && this.props.boundaryKey != null)) ||
            (nextProps.boundaryKey == null &&
                this.props.boundaryKey != null &&
                (this.context != null && this.context.tabRegistry != null))
        ) {
            this.context.tabRegistry.delete(this.props.boundaryKey);
        }
    }

    public componentDidUpdate(prevProps: TabBoundaryProps<TComp>, prevContext: TabContextTypes) {
        if (
            ((prevContext == null || prevContext.tabRegistry == null) &&
                (this.context != null && this.context.tabRegistry != null && this.props.boundaryKey != null)) ||
            (prevProps.boundaryKey == null &&
                this.props.boundaryKey != null &&
                (this.context != null && this.context.tabRegistry != null))
        ) {
            this.context.tabRegistry.add(this.props.boundaryKey, this.tabRegistry);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null && this.props.boundaryKey != null) {
            this.context.tabRegistry.delete(this.props.boundaryKey);
        }
    }

    private onKeyDown = (e: React.KeyboardEvent<any>) => {
        if (e.key === 'Tab' && e.target != null && (e.target as any).name != null) {
            const name = (e.target as any).name as string;
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                this.tabRegistry.focusPrev(name);
            } else {
                this.tabRegistry.focusNext(name);
            }
        } else if (e.key === 'Escape' && this.props.focusParentOnEscape) {
            e.preventDefault();
            e.stopPropagation();
            this.tabRegistry.focusParent();
        }
    };

    public getChildContext() {
        return {
            tabRegistry: this.tabRegistry,
        };
    }

    public render() {
        const comp = this.props.component == null ? 'div' : this.props.component;
        return React.createElement(
            comp,
            Object.assign({}, this.props.componentProps, { onKeyDown: this.onKeyDown }),
            this.props.children,
        );
    }
}
