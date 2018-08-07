import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { Focuser } from './Focuser';
import { TabBoundary, TabBoundaryContext } from './TabBoundary';

interface Props {
    className?: string;
    containerClassName?: string;
    cycle?: boolean;
    disabled?: boolean;
    focusKey: string;
}
interface State {}

export class Section extends React.Component<Props, State> {
    public static readonly contextTypes = TabBoundary.childContextTypes;
    public context!: TabBoundaryContext<string>;

    private onEnterKey = () => {
        if (this.context.tabRegistry != null) {
            this.context.tabRegistry.focusIn([this.props.focusKey, 'section'], {
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
        return (
            <TabBoundary boundaryKey={this.props.focusKey} className={containerClassName}>
                <Focuser
                    disabled={this.props.disabled}
                    focusKey="section-focuser"
                    onEnter={this.onEnterKey}
                    onEscape={this.onEscapeKey}
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
