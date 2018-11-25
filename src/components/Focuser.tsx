import * as React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { NavigationContext } from './TabBoundary';

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
export type NavigationKey = ArrowKey | 'Tab' | 'Escape' | 'Enter' | 'Delete' | 'Space' | 'Plus' | 'Minus';
export interface ModifierKeys {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

const emptyOnChange = () => {
    return;
};

interface Props {
    autoFocus?: boolean;
    className?: string;
    disabled?: boolean;
    focusKey: string;
    onArrowDown?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onArrowKeys?: (focusKey: string, arrowKey: ArrowKey, modifierKeys: ModifierKeys) => void;
    onArrowLeft?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onArrowRight?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onArrowUp?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onDelete?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onEnter?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onEscape?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onFocus?: (opts?: FocuserOptions) => void;
    onMinus?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onNavigationKeys?: (focusKey: string, navKey: NavigationKey, modifierKyes: ModifierKeys) => void;
    onPlus?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
    onSpace?: (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
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

export class Focuser extends React.Component<Props, State> {
    private refFocuser: HTMLInputElement | null = null;
    private tabRegistry: TabRegistry<string> | null = null;

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
        const modifierKeys: ModifierKeys = {
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
        };

        if (e.key === 'Enter') {
            if (this.props.onEnter != null) {
                shouldPrevent = true;
                this.props.onEnter(e, this.props.focusKey);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Enter', modifierKeys);
            }
        } else if (e.key === ' ') {
            if (this.props.onSpace != null) {
                shouldPrevent = true;
                this.props.onSpace(e, this.props.focusKey);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Space', modifierKeys);
            }
        } else if (e.key === 'Escape') {
            if (this.props.onEscape != null) {
                shouldPrevent = true;
                this.props.onEscape(e, this.props.focusKey);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Escape', modifierKeys);
            }
        } else if (e.key === 'Delete') {
            if (this.props.onDelete != null) {
                shouldPrevent = true;
                this.props.onDelete(e, this.props.focusKey);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Delete', modifierKeys);
            }
        } else if (e.key === '+') {
            if (this.props.onPlus != null) {
                shouldPrevent = true;
                this.props.onPlus(e, this.props.focusKey);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Plus', modifierKeys);
            }
        } else if (e.key === '-') {
            if (this.props.onMinus != null) {
                shouldPrevent = true;
                this.props.onMinus(e, this.props.focusKey);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Minus', modifierKeys);
            }
        } else if (e.key === 'ArrowUp') {
            if (this.props.onArrowUp != null) {
                shouldPrevent = true;
                this.props.onArrowUp(e, this.props.focusKey);
            }
            if (this.props.onArrowKeys != null) {
                shouldPrevent = true;
                this.props.onArrowKeys(this.props.focusKey, 'ArrowUp', modifierKeys);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'ArrowUp', modifierKeys);
            }
        } else if (e.key === 'ArrowDown') {
            if (this.props.onArrowDown != null) {
                shouldPrevent = true;
                this.props.onArrowDown(e, this.props.focusKey);
            }
            if (this.props.onArrowKeys != null) {
                shouldPrevent = true;
                this.props.onArrowKeys(this.props.focusKey, 'ArrowDown', modifierKeys);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'ArrowDown', modifierKeys);
            }
        } else if (e.key === 'ArrowLeft') {
            if (this.props.onArrowLeft != null) {
                shouldPrevent = true;
                this.props.onArrowLeft(e, this.props.focusKey);
            }
            if (this.props.onArrowKeys != null) {
                shouldPrevent = true;
                this.props.onArrowKeys(this.props.focusKey, 'ArrowLeft', modifierKeys);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'ArrowLeft', modifierKeys);
            }
        } else if (e.key === 'ArrowRight') {
            if (this.props.onArrowRight != null) {
                shouldPrevent = true;
                this.props.onArrowRight(e, this.props.focusKey);
            }
            if (this.props.onArrowKeys != null) {
                shouldPrevent = true;
                this.props.onArrowKeys(this.props.focusKey, 'ArrowRight', modifierKeys);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'ArrowRight', modifierKeys);
            }
        } else if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (this.tabRegistry != null) {
                    shouldPrevent = true;
                    this.tabRegistry.focusPrev(this.props.focusKey);
                }
            } else {
                if (this.tabRegistry != null) {
                    shouldPrevent = true;
                    this.tabRegistry.focusNext(this.props.focusKey);
                }
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'Tab', modifierKeys);
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
        if (this.props.disabled || this.refFocuser == null) {
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
                            className={this.props.className || 'focuser'}
                            disabled={this.props.disabled}
                            key="focuser"
                            name={String(this.props.focusKey)}
                            onBlur={this.props.onBlur}
                            onChange={emptyOnChange}
                            onKeyDown={this.onKeyDown}
                            ref={this.setFocuserRef}
                            style={styles}
                            tabIndex={-1}
                            value=""
                        />
                    );
                }}
            </NavigationContext.Consumer>
        );
    }
}
