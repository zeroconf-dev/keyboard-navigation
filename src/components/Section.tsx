import * as React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../util';
import { Focuser, ModifierKeys, NavigationKey, NavigationKeyHandler } from './Focuser';
import { NavigationContext, TabBoundary } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    autoFocus?: boolean;
    className?: string;
    cycle?: boolean;
    disabled?: boolean;
    focusKey: string;
    navigationHandler?: NavigationKeyHandler;
    onFocus?: (opts?: FocuserOptions) => void;
    tabRegistryRef?: React.MutableRefObject<TabRegistry | null>;
}

type Props<TComp extends keyof JSX.IntrinsicElements> = UnpackedHTMLAttributes<TComp> & ComponentProps<TComp>;

type PropsWithTabRegistry<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    tabRegistry: TabRegistry | null;
};

interface State {}

class SectionWithTabRegistry<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithTabRegistry<TComp>,
    State
> {
    public static displayName = 'Section';
    private refFocuser: Focuser | null = null;

    private filterPropKeys = (propKey: keyof ComponentProps<TComp> | 'tabRegistry') => {
        switch (propKey) {
            case 'as':
            case 'autoFocus':
            case 'className':
            case 'cycle':
            case 'disabled':
            case 'focusKey':
            case 'navigationHandler':
            case 'onFocus':
            case 'tabRegistry':
            case 'tabRegistryRef':
                return false;
            default:
                assertNeverNonThrow(propKey);
                return true;
        }
    };

    private navigationHandler = (_: string, navKey: NavigationKey, modifierKeys: ModifierKeys) => {
        if (this.props.navigationHandler != null) {
            this.props.navigationHandler(this.props.focusKey, navKey, modifierKeys);
        }
    };

    private onClick = (e: React.MouseEvent<any>) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.refFocuser != null) {
            this.refFocuser.focus({
                focusOrigin: 'mouse',
            });
        }
        if (this.props.onClick != null) {
            this.props.onClick(e);
        }
    };

    private onEnterKey = () => {
        if (this.props.tabRegistry != null) {
            this.props.tabRegistry.focusIn([this.props.focusKey, 'section'], {
                focusOrigin: 'parent',
            });
        }
    };

    private onEscapeKey = () => {
        if (this.props.tabRegistry != null) {
            const reg = this.props.tabRegistry.get(this.props.focusKey);
            if (reg instanceof TabRegistry) {
                reg.focusParent();
            }
        }
    };

    private setFocuserRef = (ref: Focuser | null) => {
        this.refFocuser = ref;
    };

    public render() {
        const navigationHandler = this.props.navigationHandler == null ? undefined : this.navigationHandler;
        const boundaryProps = filterPropKeys<ComponentProps<TComp>, TComp, PropsWithTabRegistry<TComp>>(
            this.props,
            this.filterPropKeys,
        );
        return (
            <TabBoundary
                className={this.props.className || 'section-container'}
                {...boundaryProps}
                as={this.props.as}
                boundaryKey={this.props.focusKey}
                onClick={this.onClick}
            >
                <Focuser
                    autoFocus={this.props.autoFocus}
                    disabled={this.props.disabled}
                    focusKey="section-focuser"
                    onEnter={this.onEnterKey}
                    onEscape={this.onEscapeKey}
                    onFocus={this.props.onFocus}
                    onNavigationKeys={navigationHandler}
                    ref={this.setFocuserRef}
                />
                <TabBoundary
                    boundaryKey="section"
                    className="section"
                    cycle={this.props.cycle}
                    focusParentOnChildOrigin={true}
                    focusParentOnEscape={true}
                    tabRegistryRef={this.props.tabRegistryRef}
                >
                    {this.props.children}
                </TabBoundary>
            </TabBoundary>
        );
    }
}

type PropsWithForwardRef<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    forwardedRef?: React.Ref<SectionWithTabRegistry<TComp>>;
};
class SectionWithForwardRef<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithForwardRef<TComp>
> {
    public static displayName = 'TabRegistry(Section)';

    private renderChildren = (tabRegistry: TabRegistry | null) => {
        const { forwardedRef, ...props } = this.props;
        return <SectionWithTabRegistry {...props} ref={forwardedRef} tabRegistry={tabRegistry} />;
    };

    public render() {
        return <NavigationContext.Consumer children={this.renderChildren} />;
    }
}

const forwardRef = <TComp extends keyof JSX.IntrinsicElements = 'div'>() =>
    React.forwardRef<SectionWithTabRegistry<TComp>, Props<TComp>>((props, ref) => (
        <SectionWithForwardRef {...props} forwardedRef={ref} />
    ));

export type Section = SectionWithTabRegistry;
export const Section = forwardRef<keyof JSX.IntrinsicElements>();
