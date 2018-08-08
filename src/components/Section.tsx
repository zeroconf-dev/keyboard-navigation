import * as React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { ArrowKey, Focuser } from './Focuser';
import { TabBoundary, TabBoundaryContext } from './TabBoundary';

interface Props<TKey extends number | string> {
    className?: string;
    containerClassName?: string;
    cycle?: boolean;
    disabled?: boolean;
    focusKey: TKey;
    navigationHandler?: (focusKey: TKey, arrowKey: ArrowKey) => void;
    onFocus?: (opts?: FocuserOptions) => void;
}
interface State {}

export class Section<TKey extends number | string = string> extends React.Component<Props<TKey>, State> {
    public static readonly contextTypes = TabBoundary.childContextTypes;
    public context!: TabBoundaryContext<TKey>;

    private navigationHandler = (_: TKey, arrowKey: ArrowKey) => {
        if (this.props.navigationHandler != null) {
            this.props.navigationHandler(this.props.focusKey, arrowKey);
        }
    };

    private onEnterKey = () => {
        if (this.context.tabRegistry != null) {
            this.context.tabRegistry.focusIn([this.props.focusKey, 'section' as TKey], {
                focusOrigin: 'parent',
            });
        }
    };

    private onEscapeKey = () => {
        if (this.context.tabRegistry != null) {
            const reg = this.context.tabRegistry.get(this.props.focusKey);
            if (reg instanceof TabRegistry) {
                reg.focusParent();
            }
        }
    };

    public render() {
        const containerClassName =
            this.props.containerClassName == null ? 'section-container' : this.props.containerClassName;
        const sectionClassName = this.props.className == null ? 'section' : this.props.className;
        const navigationHandler = this.props.navigationHandler == null ? undefined : this.navigationHandler;
        return (
            <TabBoundary boundaryKey={this.props.focusKey} className={containerClassName}>
                <Focuser
                    disabled={this.props.disabled}
                    focusKey={'section-focuser' as TKey}
                    onArrowKeys={navigationHandler}
                    onEnter={this.onEnterKey}
                    onEscape={this.onEscapeKey}
                    onFocus={this.props.onFocus}
                />
                <TabBoundary
                    boundaryKey="section"
                    className={sectionClassName}
                    cycle={this.props.cycle}
                    focusParentOnChildOrigin={true}
                    focusParentOnEscape={true}
                >
                    {this.props.children}
                </TabBoundary>
            </TabBoundary>
        );
    }
}
