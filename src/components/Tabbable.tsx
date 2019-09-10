import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import * as React from 'react';

function hasFocusFn(obj: any): obj is { focus: (...args: any[]) => boolean | void } {
    if (obj != null && typeof obj.focus === 'function') {
        return true;
    }
    /* istanbul ignore next */
    return false;
}

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

    type ResultPropsWithTabRegistry = ResultProps & { tabRegistry: TabRegistry | null };

    /* istanbul ignore next */
    const displayName = typeof Comp === 'string' ? Comp : Comp.displayName || Comp.name;

    class TabbableComponent extends React.Component<ResultPropsWithTabRegistry> {
        public static displayName = `TabRegistry(${displayName})`;
        private refComponent: TComp | null = null;

        public componentDidMount() {
            if (this.props.tabRegistry != null) {
                this.props.tabRegistry.add(this.props.name, this.focus);
            }
        }

        public componentDidUpdate(prevProps: ResultPropsWithTabRegistry) {
            if (this.props.name !== prevProps.name && this.props.tabRegistry != null) {
                this.props.tabRegistry.add(this.props.name, this.focus);
            }
        }

        public componentWillUnmount() {
            if (this.props.tabRegistry != null) {
                this.props.tabRegistry.delete(this.props.name);
            }
        }

        private focus = (): boolean => {
            if (hasFocusFn(this.refComponent) && !this.props.disabled) {
                const result = this.refComponent.focus();
                return result === true || result == null;
            }
            return false;
        };

        private onFocus = (e: React.FocusEvent<TComp>) => {
            if (this.props.onFocus != null) {
                this.props.onFocus(e);
            }
        };

        private setComponentRef = (ref: TComp): void => {
            this.refComponent = ref;
        };

        public UNSAFE_componentWillReceiveProps(nextProps: ResultPropsWithTabRegistry) {
            if (
                this.props.name !== nextProps.name &&
                this.props.tabRegistry != null &&
                this.props.tabRegistry.has(this.props.name)
            ) {
                this.props.tabRegistry.delete(this.props.name);
            }
        }

        public render() {
            const { tabRegistry, ...props } = this.props;
            return <Comp {...props} onFocus={this.onFocus} ref={this.setComponentRef} />;
        }
    }

    type PropsWithForwardRef = ResultProps & { forwardedRef?: React.Ref<TabbableComponent> };
    class TabbableComponentWithForwardRef extends React.Component<PropsWithForwardRef> {
        public static displayName = displayName;

        private renderChildren = (tabRegistry: TabRegistry | null) => {
            const { forwardedRef, ...props } = this.props;
            return <TabbableComponent {...props as ResultProps} ref={forwardedRef} tabRegistry={tabRegistry} />;
        };

        public render() {
            return <NavigationContext.Consumer children={this.renderChildren} />;
        }
    }

    return React.forwardRef<TabbableComponent, ResultProps>((props, ref) => (
        <TabbableComponentWithForwardRef {...props} forwardedRef={ref} />
    )) as React.ComponentClass<ResultProps> &
        React.ForwardRefExoticComponent<React.PropsWithoutRef<ResultProps> & React.RefAttributes<TabbableComponent>>;
}

export const Button = Tabbable('button');
export const Input = Tabbable('input');
export const Select = Tabbable('select');
export const TextArea = Tabbable('textarea');
