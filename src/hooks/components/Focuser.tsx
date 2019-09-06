import * as React from 'react';
import { FocuserOptions } from '../../TabRegistry';
import { useFocusable } from '../useFocusable';
import { useTabRegistry } from '../useTabRegistry';

// tslint:disable:react-unused-props-and-state

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

export interface FocuserRef {
    focus: (opts: FocuserOptions) => boolean;
}

export const Focuser = React.forwardRef((props: Props, ref: React.Ref<FocuserRef>) => {
    const tabRegistry = useTabRegistry();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const focus = React.useCallback(
        (opts: FocuserOptions) => {
            if (props.disabled || inputRef.current == null) {
                return false;
            }
            inputRef.current.focus();
            if (props.onFocus != null) {
                props.onFocus(opts, props.focusKey);
            }
            return true;
        },
        [props.disabled, props.focusKey, props.onFocus],
    );

    useFocusable(props.focusKey, focus);

    React.useImperativeHandle(
        ref,
        () => ({
            focus: focus,
        }),
        [focus],
    );

    const onBlur = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            if (props.onBlur != null) {
                props.onBlur(e, props.focusKey);
            }
        },
        [props.onBlur],
    );

    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (props.disabled) {
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
                if (props.onEnter != null) {
                    shouldPrevent = true;
                    props.onEnter(e, props.focusKey);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'Enter', modifierKeys);
                }
            } else if (e.key === ' ') {
                if (props.onSpace != null) {
                    shouldPrevent = true;
                    props.onSpace(e, props.focusKey);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'Space', modifierKeys);
                }
            } else if (e.key === 'Escape') {
                if (props.onEscape != null) {
                    shouldPrevent = true;
                    props.onEscape(e, props.focusKey);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'Escape', modifierKeys);
                }
            } else if (e.key === 'Delete') {
                if (props.onDelete != null) {
                    shouldPrevent = true;
                    props.onDelete(e, props.focusKey);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'Delete', modifierKeys);
                }
            } else if (e.key === '+') {
                if (props.onPlus != null) {
                    shouldPrevent = true;
                    props.onPlus(e, props.focusKey);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'Plus', modifierKeys);
                }
            } else if (e.key === '-') {
                if (props.onMinus != null) {
                    shouldPrevent = true;
                    props.onMinus(e, props.focusKey);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'Minus', modifierKeys);
                }
            } else if (e.key === '?') {
                if (props.onQuestionMark != null) {
                    shouldPrevent = true;
                    props.onQuestionMark(e, props.focusKey);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'QuestionMark', modifierKeys);
                }
            } else if (e.key === 'ArrowUp') {
                if (props.onArrowUp != null) {
                    shouldPrevent = true;
                    props.onArrowUp(e, props.focusKey);
                }
                if (props.onArrowKeys != null) {
                    shouldPrevent = true;
                    props.onArrowKeys(props.focusKey, 'ArrowUp', modifierKeys);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'ArrowUp', modifierKeys);
                }
            } else if (e.key === 'ArrowDown') {
                if (props.onArrowDown != null) {
                    shouldPrevent = true;
                    props.onArrowDown(e, props.focusKey);
                }
                if (props.onArrowKeys != null) {
                    shouldPrevent = true;
                    props.onArrowKeys(props.focusKey, 'ArrowDown', modifierKeys);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'ArrowDown', modifierKeys);
                }
            } else if (e.key === 'ArrowLeft') {
                if (props.onArrowLeft != null) {
                    shouldPrevent = true;
                    props.onArrowLeft(e, props.focusKey);
                }
                if (props.onArrowKeys != null) {
                    shouldPrevent = true;
                    props.onArrowKeys(props.focusKey, 'ArrowLeft', modifierKeys);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'ArrowLeft', modifierKeys);
                }
            } else if (e.key === 'ArrowRight') {
                if (props.onArrowRight != null) {
                    shouldPrevent = true;
                    props.onArrowRight(e, props.focusKey);
                }
                if (props.onArrowKeys != null) {
                    shouldPrevent = true;
                    props.onArrowKeys(props.focusKey, 'ArrowRight', modifierKeys);
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'ArrowRight', modifierKeys);
                }
            } else if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (tabRegistry != null) {
                        shouldPrevent = true;
                        tabRegistry.focusPrev(props.focusKey);
                    }
                } else {
                    if (tabRegistry != null) {
                        shouldPrevent = true;
                        tabRegistry.focusNext(props.focusKey);
                    }
                }
                if (props.onNavigationKeys != null) {
                    shouldPrevent = true;
                    props.onNavigationKeys(props.focusKey, 'Tab', modifierKeys);
                }
            } else if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey)) {
                shouldPrevent = true;
            }

            if (shouldPrevent) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        [
            props.disabled,
            props.focusKey,
            props.onArrowDown,
            props.onArrowKeys,
            props.onArrowLeft,
            props.onArrowRight,
            props.onArrowUp,
            props.onDelete,
            props.onEnter,
            props.onEscape,
            props.onMinus,
            props.onNavigationKeys,
            props.onPlus,
            props.onQuestionMark,
            props.onSpace,
            tabRegistry,
        ],
    );

    return (
        <input
            autoComplete="off"
            autoFocus={props.autoFocus}
            className={props.className || 'focuser'}
            disabled={props.disabled}
            key="focuser"
            name={props.focusKey}
            onBlur={onBlur}
            onChange={emptyChangeHandler}
            onKeyDown={onKeyDown}
            placeholder=""
            ref={inputRef}
            style={styles}
            tabIndex={-1}
            value=""
        />
    );
});
