import * as React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, UnpackedHTMLAttributes } from '../util';
import { ArrowKey, Focuser } from './Focuser';
import { TabBoundary, TabBoundaryContext } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> {
    autoFocus?: boolean;
    component?: TComp;
    cycle?: boolean;
    disabled?: boolean;
    focusKey: TKey;
    navigationHandler?: (focusKey: TKey, arrowKey: ArrowKey) => void;
    onFocus?: (opts?: FocuserOptions) => void;
}

type Props<TComp extends keyof JSX.IntrinsicElements, TKey extends number | string> = UnpackedHTMLAttributes<TComp> &
    ComponentProps<TComp, TKey>;

interface State {}

export class Section<
    TComp extends keyof JSX.IntrinsicElements = 'div',
    TKey extends number | string = string
> extends React.Component<Props<TComp, TKey>, State> {
    public static readonly contextTypes = TabBoundary.childContextTypes;

    private refFocuser: Focuser<TKey> | null = null;
    public context!: TabBoundaryContext<TKey>;

    private filterPropKeys = (propKey: keyof ComponentProps<TComp, TKey>) => {
        switch (propKey) {
            case 'autoFocus':
            case 'component':
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

    private navigationHandler = (_: TKey, arrowKey: ArrowKey) => {
        if (this.props.navigationHandler != null) {
            this.props.navigationHandler(this.props.focusKey, arrowKey);
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
        if (this.context.tabRegistry != null) {
            this.context.tabRegistry.focusIn([this.props.focusKey, 'section' as TKey], {
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

    private setFocuserRef = (ref: Focuser<TKey> | null) => {
        this.refFocuser = ref;
    };

    public render() {
        const navigationHandler = this.props.navigationHandler == null ? undefined : this.navigationHandler;
        const boundaryProps = filterPropKeys<ComponentProps<TComp, TKey>, TComp, Props<TComp, TKey>>(
            this.props,
            this.filterPropKeys,
        );
        return (
            <TabBoundary
                className="section-container"
                {...boundaryProps}
                boundaryKey={this.props.focusKey}
                component={this.props.component}
                onClick={this.onClick}
            >
                <Focuser
                    autoFocus={this.props.autoFocus}
                    disabled={this.props.disabled}
                    focusKey={'section-focuser' as TKey}
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
    }
}
