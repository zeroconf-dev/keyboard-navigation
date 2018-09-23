import * as React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { NavigationContext } from './TabBoundary';

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
export type NavigationKey = ArrowKey | 'Tab' | 'ShiftTab' | 'Escape' | 'Enter' | 'Delete' | 'Space';

interface Props<T extends number | string = string> {
    autoFocus?: boolean;
    disabled?: boolean;
    focusKey: T;
    onArrowDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onArrowKeys?: (focusKey: T, arrowKey: ArrowKey) => void;
    onArrowLeft?: React.KeyboardEventHandler<HTMLInputElement>;
    onArrowRight?: React.KeyboardEventHandler<HTMLInputElement>;
    onArrowUp?: React.KeyboardEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onDelete?: React.KeyboardEventHandler<HTMLInputElement>;
    onEnter?: React.KeyboardEventHandler<HTMLInputElement>;
    onEscape?: React.KeyboardEventHandler<HTMLInputElement>;
    onFocus?: (opts?: FocuserOptions) => void;
    onNavigationKeys?: (focusKey: T, navKey: NavigationKey) => void;
    onSpace?: React.KeyboardEventHandler<HTMLInputElement>;
}
interface State {}

const styles: React.CSSProperties = {
    border: 'none',
    display: 'inline',
    float: 'left',
    fontSize: 0,
    height: 0,
    lineHeight: 0,
    margin: 0,
    outline: 'none',
    padding: 0,
    width: 0,
};

export class Focuser<TKey extends number | string = string> extends React.Component<Props<TKey>, State> {
    private refFocuser: HTMLInputElement | null = null;
    private tabRegistry: TabRegistry<TKey> | null = null;

    public componentWillUnmount() {
        if (this.tabRegistry != null) {
            this.tabRegistry.delete(this.props.focusKey);
            this.tabRegistry = null;
        }
    }

    private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.disabled) {
            return;
        }

        let shouldPrevent = false;

        if (e.key === 'Enter') {
            if (this.props.onEnter != null) {
                shouldPrevent = true;
                this.props.onEnter(e);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Enter');
            }
        } else if (e.key === ' ') {
            if (this.props.onSpace != null) {
                shouldPrevent = true;
                this.props.onSpace(e);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Space');
            }
        } else if (e.key === 'Escape') {
            if (this.props.onEscape != null) {
                shouldPrevent = true;
                this.props.onEscape(e);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Escape');
            }
        } else if (e.key === 'Delete') {
            if (this.props.onDelete != null) {
                shouldPrevent = true;
                this.props.onDelete(e);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Delete');
            }
        } else if (e.key === 'ArrowUp') {
            if (this.props.onArrowUp != null) {
                shouldPrevent = true;
                this.props.onArrowUp(e);
            }
            if (this.props.onArrowKeys != null) {
                shouldPrevent = true;
                this.props.onArrowKeys(this.props.focusKey, 'ArrowUp');
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'ArrowUp');
            }
        } else if (e.key === 'ArrowDown') {
            if (this.props.onArrowDown != null) {
                shouldPrevent = true;
                this.props.onArrowDown(e);
            }
            if (this.props.onArrowKeys != null) {
                shouldPrevent = true;
                this.props.onArrowKeys(this.props.focusKey, 'ArrowDown');
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'ArrowDown');
            }
        } else if (e.key === 'ArrowLeft') {
            if (this.props.onArrowLeft != null) {
                shouldPrevent = true;
                this.props.onArrowLeft(e);
            }
            if (this.props.onArrowKeys != null) {
                shouldPrevent = true;
                this.props.onArrowKeys(this.props.focusKey, 'ArrowLeft');
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'ArrowLeft');
            }
        } else if (e.key === 'ArrowRight') {
            if (this.props.onArrowRight != null) {
                shouldPrevent = true;
                this.props.onArrowRight(e);
            }
            if (this.props.onArrowKeys != null) {
                shouldPrevent = true;
                this.props.onArrowKeys(this.props.focusKey, 'ArrowRight');
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'ArrowRight');
            }
        } else if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (this.tabRegistry != null) {
                    shouldPrevent = true;
                    this.tabRegistry.focusPrev(this.props.focusKey);
                }
                if (this.props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    this.props.onNavigationKeys(this.props.focusKey, 'ShiftTab');
                }
            } else {
                if (this.tabRegistry != null) {
                    shouldPrevent = true;
                    this.tabRegistry.focusNext(this.props.focusKey);
                }
                if (this.props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    this.props.onNavigationKeys(this.props.focusKey, 'Tab');
                }
            }
        } else if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey)) {
            shouldPrevent = true;
        }

        if (shouldPrevent) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    private setFocuserRef = (ref: HTMLInputElement | null) => {
        this.refFocuser = ref;
    };

    public focus = (opts?: FocuserOptions) => {
        if (this.props.disabled || this.tabRegistry == null || this.refFocuser == null) {
            return false;
        }
        this.refFocuser.focus();
        if (this.props.onFocus) {
            this.props.onFocus(opts);
        }
        return true;
    };

    public render() {
        return (
            <NavigationContext.Consumer>
                {tabRegistry => {
                    if (this.tabRegistry != null && this.tabRegistry !== tabRegistry) {
                        this.tabRegistry.delete(this.props.focusKey);
                    }
                    if (tabRegistry != null && this.tabRegistry !== tabRegistry) {
                        tabRegistry.add(this.props.focusKey, this.focus);
                    }
                    this.tabRegistry = tabRegistry;
                    return (
                        <input
                            autoComplete="off"
                            autoFocus={this.props.autoFocus}
                            defaultValue=""
                            disabled={this.props.disabled}
                            key="focuser"
                            name={String(this.props.focusKey)}
                            onBlur={this.props.onBlur}
                            onKeyDown={this.onKeyDown}
                            ref={this.setFocuserRef}
                            style={styles}
                            tabIndex={-1}
                        />
                    );
                }}
            </NavigationContext.Consumer>
        );
    }
}
