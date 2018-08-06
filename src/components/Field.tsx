import * as React from 'react';
import { FocuserOptions } from '../TabRegistry';
import { ArrowKey, Focuser, NavigationKey } from './Focuser';
import { TabBoundary } from './TabBoundary';

interface Props<T extends number | string = string> {
    disabled?: boolean;
    label: T;
    onArrowKeys?: (label: T, arrowKey: ArrowKey) => void;
    onDelete?: () => void;
    onEditStart?: (stopEditing: () => void) => void;
    onEditStop?: () => void;
    onNavKeys?: (label: T, navKey: NavigationKey) => void;
    onSubmit: (stopEditing: (preventFocus?: boolean) => void) => void;
    preventBlurHandler?: boolean;
    renderEditor: (isEditing: boolean, stopEditing: () => void) => JSX.Element | null | false;
}
interface State {
    isEditing: boolean;
}

export class Field<T extends number | string = string> extends React.Component<Props<T>, State> {
    public static readonly contextTypes = TabBoundary.childContextTypes;

    private refFocuser: Focuser<T> | null = null;
    public constructor(props: Props<T>) {
        super(props);
        this.state = {
            isEditing: false,
        };
    }

    public componentWillReceiveProps(nextProps: Props<T>) {
        if (!this.props.disabled && nextProps.disabled) {
            this.stopEditing(true);
        }
    }

    private focus(opts?: FocuserOptions) {
        if (this.props.disabled || this.refFocuser == null) {
            return false;
        }
        return this.refFocuser.focus(opts);
    }

    private onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        // don't prevent default on blur event
        // or else the field actually won't get blurred.
        e.stopPropagation();

        if (this.props.disabled || !this.state.isEditing || this.props.preventBlurHandler) {
            return;
        }

        this.props.onSubmit(this.stopEditing);
    };

    private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.startEditing();
    };

    private onEnter = () => this.startEditing();

    private onEscape = () => {
        if (this.state.isEditing) {
            this.stopEditing();
        } else {
            if (this.context.tabRegistry != null) {
                this.context.tabRegistry.focusParent();
            }
        }
    };

    private onFieldKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.props.disabled) {
            return;
        }

        if (e.key === 'Enter' && !(e.shiftKey || e.metaKey || e.ctrlKey || e.altKey)) {
            e.preventDefault();
            e.stopPropagation();
            this.props.onSubmit(this.stopEditing);
        }
    };

    private onLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();

        this.focus({
            focusOrigin: 'mouse',
        });
    };

    private setFocuserRef = (ref: Focuser<T> | null) => {
        this.refFocuser = ref;
    };

    private startEditing = () => {
        if (this.props.disabled || this.state.isEditing) {
            return;
        }

        this.setState({
            isEditing: true,
        });

        if (this.props.onEditStart != null) {
            this.props.onEditStart(this.stopEditing);
        }
    };

    private stopEditing = (preventFocus?: boolean) => {
        if (!this.state.isEditing) {
            return;
        }

        this.setState(
            {
                isEditing: false,
            },
            () => {
                if (preventFocus) {
                    return;
                }
                this.focus({
                    focusOrigin: 'user',
                });
            },
        );

        if (this.props.onEditStop != null) {
            this.props.onEditStop();
        }
    };

    public render() {
        return (
            <div className="field-container">
                <Focuser
                    disabled={this.props.disabled}
                    focusKey={this.props.label}
                    key="focuser"
                    onArrowKeys={this.props.onArrowKeys}
                    onDelete={this.props.onDelete}
                    onEnter={this.onEnter}
                    onEscape={this.onEscape}
                    onNavigationKeys={this.props.onNavKeys}
                    ref={this.setFocuserRef}
                />
                <div className="field" onBlur={this.onBlur} onClick={this.onClick} onKeyDown={this.onFieldKeyDown}>
                    <label onClick={this.onLabelClick}>{this.props.label}</label>
                    {this.props.renderEditor(this.state.isEditing, this.stopEditing)}
                </div>
            </div>
        );
    }
}
