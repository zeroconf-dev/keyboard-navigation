import * as React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../util';
import { ArrowKey, Focuser, ModifierKeys } from './Focuser';
import { NavigationContext, TabBoundary } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> {
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;
    autoFocus?: boolean;
    className?: string;
    cycle?: boolean;
    disabled?: boolean;
    focusKey: string;
    navigationHandler?: (focusKey: string, arrowKey: ArrowKey, modifierKeys: ModifierKeys) => void;
    onFocus?: (opts?: FocuserOptions) => void;
}

type Props<TComp extends keyof JSX.IntrinsicElements> = UnpackedHTMLAttributes<TComp> & ComponentProps<TComp>;

interface State {}

export class Section<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<Props<TComp>, State> {
    private refFocuser: Focuser | null = null;
    private tabRegistry: TabRegistry<string> | null = null;

    private filterPropKeys = (propKey: keyof ComponentProps<TComp>) => {
        switch (propKey) {
            case 'as':
            case 'autoFocus':
            case 'className':
            case 'cycle':
            case 'disabled':
            case 'focusKey':
            case 'navigationHandler':
            case 'onFocus':
                return false;
            default:
                assertNeverNonThrow(propKey);
                return true;
        }
    };

    private navigationHandler = (_: string, arrowKey: ArrowKey, modifierKeys: ModifierKeys) => {
        if (this.props.navigationHandler != null) {
            this.props.navigationHandler(this.props.focusKey, arrowKey, modifierKeys);
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
    };

    private onEnterKey = () => {
        if (this.tabRegistry != null) {
            this.tabRegistry.focusIn([this.props.focusKey, 'section'], {
                focusOrigin: 'parent',
            });
        }
    };

    private onEscapeKey = () => {
        if (this.tabRegistry != null) {
            const reg = this.tabRegistry.get(this.props.focusKey);
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
        const boundaryProps = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(
            this.props,
            this.filterPropKeys,
        );
        return (
            <NavigationContext.Consumer>
                {tabRegistry => {
                    this.tabRegistry = tabRegistry;
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
                                onArrowKeys={navigationHandler}
                                onEnter={this.onEnterKey}
                                onEscape={this.onEscapeKey}
                                onFocus={this.props.onFocus}
                                ref={this.setFocuserRef}
                            />
                            <TabBoundary
                                boundaryKey="section"
                                className="section"
                                cycle={this.props.cycle}
                                focusParentOnChildOrigin={true}
                                focusParentOnEscape={true}
                            >
                                {this.props.children}
                            </TabBoundary>
                        </TabBoundary>
                    );
                }}
            </NavigationContext.Consumer>
        );
    }
}
