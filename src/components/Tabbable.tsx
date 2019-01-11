import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { NavigationContext } from './NavigationContext';

export interface TabbableProps {
    name: string;
}

type Component = keyof JSX.IntrinsicElements | React.ComponentClass<any>;

type ComponentPropTypes<TComp extends Component> = TComp extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[TComp]
    : TComp extends React.ComponentClass<infer Props>
    ? Props
    : never;

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

    return class extends React.Component<ResultProps> {
        private refComponent: React.ReactElement<OriginalProps> | null = null;
        private tabRegistry: TabRegistry | null = null;

        public componentWillUnmount() {
            if (this.tabRegistry != null) {
                this.tabRegistry.delete(this.props.name);
                this.tabRegistry = null;
            }
        }

        private focusTabbable = (): boolean => {
            if (this.refComponent instanceof HTMLElement) {
                this.refComponent.focus();
                return true;
            }
            return false;
        };

        private renderWithTabRegistry = (tabRegistry: TabRegistry<string> | null) => {
            if (this.tabRegistry != null && tabRegistry !== this.tabRegistry) {
                this.tabRegistry.delete(this.props.name);
            }
            if (tabRegistry != null) {
                tabRegistry.add(this.props.name, this.focusTabbable);
            }
            this.tabRegistry = tabRegistry;

            const WrappedComponent = Comp as React.ComponentClass<ComponentPropTypes<TComp>>;

            return <WrappedComponent {...this.props} {...this.state} ref={this.setComponentRef} />;
        };

        private setComponentRef = (ref: any): void => {
            this.refComponent = ref;
        };

        public render() {
            return <NavigationContext.Consumer>{this.renderWithTabRegistry}</NavigationContext.Consumer>;
        }
    };
}

export const Button = Tabbable('button');
export const Input = Tabbable('input');
export const Select = Tabbable('select');
export const TextArea = Tabbable('textarea');
