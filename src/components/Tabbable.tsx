import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { TabContextTypes } from './TabContext';

export interface TabbableProps extends React.HTMLProps<HTMLInputElement> {
    focus?: boolean;
}
export interface TabbableState {
    hasFocus: boolean;
}

export function Tabbable<CompProps>(
    Comp: new () => React.Component<CompProps>,
): React.ComponentClass<CompProps & TabbableProps> {
    return class extends React.Component<CompProps & TabbableProps, TabbableState> {
        public static contextTypes = {
            tabRegistry: PropTypes.instanceOf(TabRegistry),
        };

        private refComponent: React.ReactElement<CompProps>;
        public context: TabContextTypes | null | undefined;

        public constructor(props: CompProps & TabbableProps, context?: TabContextTypes) {
            super(props, context);
            this.state = {
                hasFocus: false,
            };
        }

        public componentDidMount() {
            if (this.context != null && this.context.tabRegistry != null) {
                this.context.tabRegistry.add(this.props.name, this.focusTabble);
            }
        }

        private bindComponentRef = (ref: any): void => {
            this.refComponent = ref;
            if (this.props.focus) {
                this.focusTabble();
            }
        };

        private focusTabble = (): boolean => {
            if (this.refComponent instanceof HTMLElement) {
                this.refComponent.focus();
                return true;
            }
            return false;
        };

        public render() {
            return (
                <Comp {...this.props} {...this.state} ref={this.bindComponentRef}>
                    {this.props.children}
                </Comp>
            );
        }
    };
}

export const Button = Tabbable('button' as any);
export const Input = Tabbable('input' as any);
export const Select = Tabbable('select' as any);
export const TextArea = Tabbable('textarea' as any);
