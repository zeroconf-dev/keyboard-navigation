import * as React from 'react';
import { FocuserOptions, TabRegistry } from 'TabRegistry';

export interface InputHOCProps {}
export interface InputHOCState {
    hasFocus: boolean;
}

export interface ContextTypes {
    tabRegistry?: TabRegistry;
}

export function InputHoc<Props>(Component: React.ComponentClass<Props>): React.ComponentClass<Props & InputHOCProps> {
    return class extends React.Component<Props, InputHOCState> {
        private refComponent: React.ReactElement<any>;
        public context: ContextTypes | null | undefined;

        public constructor(props: Props, context?: ContextTypes) {
            super(props, context);
            this.state = {
                hasFocus: false,
            };
        }

        private bindComponentRef = (ref: React.ReactElement<any>) => {
            this.refComponent = ref;
        };

        private focus = (e: FocuserOptions) => {
            if (typeof this.refComponent.type === 'string') {
                this.refComponent.focus();
            }
        };

        public render() {
            return (
                <Component {...this.props} {...this.state} ref={this.bindComponentRef}>
                    {this.props.children}
                </Component>
            );
        }
    };
}
