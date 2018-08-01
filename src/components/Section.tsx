import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { Focuser } from './Focuser';
import { TabBoundary } from './TabBoundary';
import { TabContextTypes } from './TabContext';

interface Props {
    className?: string;
    cycle?: boolean;
    disabled?: boolean;
    focusKey: string;
}
interface State {}

export class Section extends React.Component<Props, State> {
    public static readonly contextTypes = TabBoundary.childContextTypes;
    public context!: TabContextTypes<string>;

    private onEnterKey = () => {
        if (this.context.tabRegistry != null) {
            this.context.tabRegistry.focusIn([this.props.focusKey, 'section-container'], {
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
        return (
            <TabBoundary boundaryKey={this.props.focusKey} componentProps={{ className: 'section-container' }}>
                <Focuser
                    disabled={this.props.disabled}
                    focusKey="section-focuser"
                    onEnter={this.onEnterKey}
                    onEscape={this.onEscapeKey}
                />
                <TabBoundary
                    boundaryKey="section"
                    componentProps={{ className: 'section' }}
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
