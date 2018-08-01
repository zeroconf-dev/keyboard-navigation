import * as React from 'react';
import { FocuserOptions } from '../TabRegistry';
import { TabBoundary } from './TabBoundary';
import { TabContextTypes } from './TabContext';

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

interface Props {
    autoFocus?: boolean;
    disabled?: boolean;
    focusKey: string;
    onArrowDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onArrowKeys?: (focusKey: string, arrowKey: ArrowKey) => void;
    onArrowLeft?: React.KeyboardEventHandler<HTMLInputElement>;
    onArrowRight?: React.KeyboardEventHandler<HTMLInputElement>;
    onArrowUp?: React.KeyboardEventHandler<HTMLInputElement>;
    onDelete?: React.KeyboardEventHandler<HTMLInputElement>;
    onEnter?: React.KeyboardEventHandler<HTMLInputElement>;
    onEscape?: React.KeyboardEventHandler<HTMLInputElement>;
    onSpace?: React.KeyboardEventHandler<HTMLInputElement>;
}
interface State {}

export class Focuser extends React.Component<Props, State> {
    public static readonly contextTypes = TabBoundary.childContextTypes;

    private refFocuser: HTMLInputElement | null = null;
    public context!: TabContextTypes;

    public componentDidMount() {
        if (this.context.tabRegistry != null) {
            this.context.tabRegistry.add(this.props.focusKey, this.focus);
        }
    }

    public componentWillUnmount() {
        if (this.context.tabRegistry != null) {
            this.context.tabRegistry.delete(this.props.focusKey);
        }
    }

    private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.props.disabled) {
            return;
        }

        if (e.key === 'Enter') {
            if (this.props.onEnter != null) {
                this.props.onEnter(e);
            }
        } else if (e.key === 'Space') {
            if (this.props.onSpace != null) {
                this.props.onSpace(e);
            }
        } else if (e.key === 'Escape') {
            if (this.props.onEscape != null) {
                this.props.onEscape(e);
            }
        } else if (e.key === 'Delete') {
            if (this.props.onDelete != null) {
                this.props.onDelete(e);
            }
        } else if (e.key === 'ArrowUp') {
            if (this.props.onArrowUp != null) {
                this.props.onArrowUp(e);
            }
            if (this.props.onArrowKeys != null) {
                this.props.onArrowKeys(this.props.focusKey, 'ArrowUp');
            }
        } else if (e.key === 'ArrowDown') {
            if (this.props.onArrowDown != null) {
                this.props.onArrowDown(e);
            }
            if (this.props.onArrowKeys != null) {
                this.props.onArrowKeys(this.props.focusKey, 'ArrowDown');
            }
        } else if (e.key === 'ArrowLeft') {
            if (this.props.onArrowLeft != null) {
                this.props.onArrowLeft(e);
            }
            if (this.props.onArrowKeys != null) {
                this.props.onArrowKeys(this.props.focusKey, 'ArrowLeft');
            }
        } else if (e.key === 'ArrowRight') {
            if (this.props.onArrowRight != null) {
                this.props.onArrowRight(e);
            }
            if (this.props.onArrowKeys != null) {
                this.props.onArrowKeys(this.props.focusKey, 'ArrowRight');
            }
        } else if (e.key === 'Tab') {
            if (this.context.tabRegistry != null) {
                if (e.shiftKey) {
                    this.context.tabRegistry.focusPrev(this.props.focusKey);
                } else {
                    this.context.tabRegistry.focusNext(this.props.focusKey);
                }
            }
        }
    };
    private setFocuserRef = (ref: HTMLInputElement | null) => {
        this.refFocuser = ref;
    };

    // tslint:disable-next-line:variable-name
    public focus = (_opts?: FocuserOptions) => {
        if (this.props.disabled || this.context.tabRegistry == null || this.refFocuser == null) {
            return false;
        }
        this.refFocuser.focus();
        return true;
    };

    public render() {
        return (
            <input
                autoComplete="off"
                autoFocus={this.props.autoFocus}
                disabled={this.props.disabled}
                key="focuser"
                name={this.props.focusKey}
                onKeyDown={this.onKeyDown}
                ref={this.setFocuserRef}
                value=""
            />
        );
    }
}
