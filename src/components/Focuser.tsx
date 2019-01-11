import React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { NavigationContext } from './NavigationContext';

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
export type NavigationKey =
    | ArrowKey
    | 'Tab'
    | 'Escape'
    | 'Enter'
    | 'Delete'
    | 'Space'
    | 'Plus'
    | 'Minus'
    | 'QuestionMark';

export interface ModifierKeys {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

export type ArrowKeyHandler = (focusKey: string, arrowKey: ArrowKey, modifierKeys: ModifierKeys) => void;
export type BlurEventHandler = (e: React.FocusEvent<HTMLInputElement>, focusKey: string) => void;
export type FocusEventHandler = (opts: FocuserOptions, focusKey: string) => void;
export type KeyboardEventHandler = (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => void;
export type NavigationKeyHandler = (focusKey: string, navKey: NavigationKey, modifierKyes: ModifierKeys) => void;

const emptyChangeHandler = () => {
    return;
};

export interface ControlProps {
    /**
     * Focus the underlaying input field upon mount.
     */
    autoFocus?: boolean;

    /**
     * Whether or not the focuser is disabled; cannot be focused,
     * thus will not propagation any events.
     * A TabBoundary will skip this component, if trying to
     * focus it via focusNext/focusPrev and friends.
     */
    disabled?: boolean;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the down arrow key on the keyboard.
     */
    onArrowDown?: KeyboardEventHandler;

    /**
     * Called when the underlying input field has focus and the
     * user presses down any arrow key of the keyboard.
     * @deprecated use [onNavigationKeys].
     */
    onArrowKeys?: ArrowKeyHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the left arrow key on the keyboard.
     */
    onArrowLeft?: KeyboardEventHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the right arrow key on the keyboard.
     */
    onArrowRight?: KeyboardEventHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the up arrow key on the keyboard.
     */
    onArrowUp?: KeyboardEventHandler;

    /**
     * Called when the underlying input loses focus.
     */
    onBlur?: BlurEventHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the delete key on the keyboard.
     */
    onDelete?: KeyboardEventHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the enter key on the keyboard.
     */
    onEnter?: KeyboardEventHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the escape key on the keyboard.
     */
    onEscape?: KeyboardEventHandler;

    /**
     * Called when the underlaying input field gains focus.
     */
    onFocus?: FocusEventHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the minus key on the keyboard.
     */
    onMinus?: KeyboardEventHandler;

    /**
     * Called when any of the listed navigation keys are pressed while
     * the underlying input field has focus.
     */
    onNavigationKeys?: NavigationKeyHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the plus key on the keyboard.
     */
    onPlus?: KeyboardEventHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the question mark key on the keyboard.
     */
    onQuestionMark?: KeyboardEventHandler;

    /**
     * Called when the underlying input field has focus and the user,
     * presses down the space key on the keyboard.
     */
    onSpace?: KeyboardEventHandler;
}

export interface Props extends ControlProps {
    /**
     * Set the classname of the underlaying input field,
     * this makes the component compatible with most css-in-js libraries
     * like styled-components, glamor and emotion etc.
     */
    className?: string;

    /**
     * Unique identifier among siblings within a TabBoundary or TabRegistry.
     */
    focusKey: string;
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

type PropsWithTabRegistry = Props & { tabRegistry: TabRegistry | null };

class FocuserWithTabRegistry extends React.Component<PropsWithTabRegistry, State> {
    public static defaultProps = {
        autoFocus: false,
        disabled: false,
    };
    public static displayName = 'Focuser';

    private refFocuser: HTMLInputElement | null = null;

    public componentDidMount() {
        if (this.props.tabRegistry != null) {
            this.props.tabRegistry.add(this.props.focusKey, this.focus);
        }
    }

    public componentWillReceiveProps(nextProps: PropsWithTabRegistry) {
        if (
            this.props.focusKey !== nextProps.focusKey &&
            this.props.tabRegistry != null &&
            this.props.tabRegistry.has(this.props.focusKey)
        ) {
            this.props.tabRegistry.delete(this.props.focusKey);
        }
    }

    public componentDidUpdate(prevProps: PropsWithTabRegistry) {
        if (this.props.focusKey !== prevProps.focusKey && this.props.tabRegistry != null) {
            this.props.tabRegistry.add(this.props.focusKey, this.focus);
        }
    }

    public componentWillUnmount() {
        if (this.props.tabRegistry != null) {
            this.props.tabRegistry.delete(this.props.focusKey);
        }
    }

    private onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (this.props.onBlur != null) {
            this.props.onBlur(e, this.props.focusKey);
        }
    };

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
        } else if (e.key === '?') {
            if (this.props.onQuestionMark != null) {
                shouldPrevent = true;
                this.props.onQuestionMark(e, this.props.focusKey);
            }
            if (this.props.onNavigationKeys != null) {
                shouldPrevent = true;
                this.props.onNavigationKeys(this.props.focusKey, 'QuestionMark', modifierKeys);
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
                if (this.props.tabRegistry != null) {
                    shouldPrevent = true;
                    this.props.tabRegistry.focusPrev(this.props.focusKey);
                }
            } else {
                if (this.props.tabRegistry != null) {
                    shouldPrevent = true;
                    this.props.tabRegistry.focusNext(this.props.focusKey);
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

    public focus = (opts: FocuserOptions) => {
        if (this.props.disabled || this.refFocuser == null) {
            return false;
        }
        this.refFocuser.focus();
        if (this.props.onFocus) {
            this.props.onFocus(opts, this.props.focusKey);
        }
        return true;
    };

    public render() {
        return (
            <input
                autoComplete="off"
                autoFocus={this.props.autoFocus}
                className={this.props.className || 'focuser'}
                disabled={this.props.disabled}
                key="focuser"
                name={this.props.focusKey}
                onBlur={this.onBlur}
                onChange={emptyChangeHandler}
                onKeyDown={this.onKeyDown}
                ref={this.setFocuserRef}
                style={styles}
                tabIndex={-1}
                value=""
            />
        );
    }
}

type PropsWithForwardRef = Props & { forwardedRef?: React.Ref<FocuserWithTabRegistry> };
class FocuserWithForwardRef extends React.Component<PropsWithForwardRef> {
    public static displayName = 'TabRegistry(Focuser)';

    private renderChildren = (tabRegistry: TabRegistry | null) => {
        const { forwardedRef, ...props } = this.props;
        return <FocuserWithTabRegistry {...props} ref={forwardedRef} tabRegistry={tabRegistry} />;
    };

    public render() {
        return <NavigationContext.Consumer children={this.renderChildren} />;
    }
}

/**
 * Base component which is the heart of this library, a component that simply can
 * have focus and listen to key strokes. Common navigation handlers are made available
 * to minimize the boilable about designing keyboard interactive interfaces.
 */
export type Focuser = FocuserWithTabRegistry;
export const Focuser = React.forwardRef<FocuserWithTabRegistry, Props>((props, ref) => (
    <FocuserWithForwardRef {...props} forwardedRef={ref} />
)) as React.ComponentClass<Props> &
    React.ForwardRefExoticComponent<React.PropsWithoutRef<Props> & React.RefAttributes<FocuserWithTabRegistry>>;
