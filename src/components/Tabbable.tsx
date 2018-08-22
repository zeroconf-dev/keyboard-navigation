import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { TabBoundaryContext } from './TabBoundary';

export interface TabbableProps {
    focus?: boolean;
    name: string;
}
export interface TabbableState {
    hasFocus: boolean;
}

type Component = keyof JSX.IntrinsicElements | React.ComponentClass<any>;

type ComponentPropTypes<TComp extends Component> = TComp extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[TComp]
    : TComp extends React.ComponentClass<infer Props> ? Props : never;

export function Tabbable<TElm extends keyof JSX.IntrinsicElements>(
    Comp: TElm,
): React.ComponentClass<ComponentPropTypes<TElm> & TabbableProps>;
export function Tabbable<TComp extends React.ComponentClass<any>>(
    Comp: TComp,
): React.ComponentClass<ComponentPropTypes<TComp> & TabbableProps>;
export function Tabbable<TComp extends Component>(
    Comp: Component,
): React.ComponentClass<ComponentPropTypes<TComp> & TabbableProps> {
    type OriginalProps = ComponentPropTypes<TComp>;
    type ResultProps = OriginalProps & TabbableProps;

    type ContextType = TabBoundaryContext<string> | undefined;
    return class extends React.Component<ResultProps, TabbableState> {
        public static contextTypes = {
            tabRegistry: PropTypes.instanceOf(TabRegistry),
        };

        private refComponent: React.ReactElement<OriginalProps> | null = null;
        public context: ContextType;

        public constructor(props?: ResultProps, context?: ContextType) {
            super(props, context);
            this.state = {
                hasFocus: false,
            };
        }

        public componentDidMount() {
            if (this.context != null && this.context.tabRegistry != null) {
                this.context.tabRegistry.add(this.props.name, this.focusTabbable);
            }
        }

        private focusTabbable = (): boolean => {
            if (this.refComponent instanceof HTMLElement) {
                this.refComponent.focus();
                return true;
            }
            return false;
        };

        private setComponentRef = (ref: any): void => {
            this.refComponent = ref;
            if (this.props.focus) {
                this.focusTabbable();
            }
        };

        public render() {
            return (
                <Comp {...this.props} {...this.state} ref={this.setComponentRef}>
                    {this.props.children}
                </Comp>
            );
        }
    };
}

export const Button = Tabbable('button');
export const Input = Tabbable('input');
export const Select = Tabbable('select');
export const TextArea = Tabbable('textarea');
