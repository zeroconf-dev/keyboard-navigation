import * as React from 'react';
import { TabRegistry } from 'TabRegistry';

export interface TabbableProps {
    focus: boolean;
    tabId: string;
}
export interface TabbableState {
    hasFocus: boolean;
}

export interface ContextTypes {
    tabRegistry?: TabRegistry;
}

export function Tabbable<CompProps>(
    Comp: new () => React.Component<CompProps>,
): React.ComponentClass<CompProps & TabbableProps> {
    return class extends React.Component<CompProps & TabbableProps, TabbableState> {
        private refComponent: React.ReactElement<CompProps>;
        public context: ContextTypes | null | undefined;

        public constructor(props: CompProps & TabbableProps, context?: ContextTypes) {
            super(props, context);
            this.state = {
                hasFocus: false,
            };
        }

        public componentDidMount() {
            if (this.context != null && this.context.tabRegistry != null) {
                this.context.tabRegistry.add(this.props.tabId, this.focusTabble);
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

class HTMLButton extends React.Component<React.HTMLProps<HTMLButtonElement>, {}> {
    public render() {
        return <button {...this.props} />;
    }
}

class HTMLInput extends React.Component<React.HTMLProps<HTMLInputElement>, {}> {
    public render() {
        return <input {...this.props} />;
    }
}

class HTMLSelect extends React.Component<React.HTMLProps<HTMLSelectElement>, {}> {
    public render() {
        return (
            <select {...this.props}>
                {this.props.children}
            </select>
        );
    }
}

class HTMLTextArea extends React.Component<React.HTMLProps<HTMLTextAreaElement>, {}> {
    public render() {
        return <textarea {...this.props} />;
    }
}

export const Button = Tabbable(HTMLButton);
export const Input = Tabbable(HTMLInput);
export const Select = Tabbable(HTMLSelect);
export const TextArea = Tabbable(HTMLTextArea);
