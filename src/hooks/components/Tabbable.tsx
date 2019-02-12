import React from 'react';
import { useFocusable } from '../useFocusable';

export interface TabbableProps {
    name: string;
}

type ButtonProps = JSX.IntrinsicElements['button'] & TabbableProps;
export const Button = React.forwardRef((props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const disabled = props.disabled || false;

    const focus = React.useCallback(() => {
        if (buttonRef.current == null || disabled) {
            return false;
        }
        buttonRef.current.focus();
        return true;
    }, [props.name, disabled]);

    if (typeof ref === 'function') {
        ref(buttonRef.current);
    } else if (typeof ref === 'object' && ref != null) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = buttonRef.current;
    }

    useFocusable(props.name, focus);

    return <button {...props} ref={buttonRef} />;
});

type InputProps = JSX.IntrinsicElements['input'] & TabbableProps;
export const Input = React.forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const disabled = props.disabled || false;

    const focus = React.useCallback(() => {
        if (inputRef.current == null || disabled) {
            return false;
        }
        inputRef.current.focus();
        return true;
    }, [props.name, disabled]);

    if (typeof ref === 'function') {
        ref(inputRef.current);
    } else if (typeof ref === 'object' && ref != null) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = inputRef.current;
    }

    useFocusable(props.name, focus);

    return <input {...props} ref={inputRef} />;
});

type SelectProps = JSX.IntrinsicElements['select'] & TabbableProps;
export const Select = React.forwardRef((props: SelectProps, ref: React.Ref<HTMLSelectElement>) => {
    const selectRef = React.useRef<HTMLSelectElement>(null);
    const disabled = props.disabled || false;

    const focus = React.useCallback(() => {
        if (selectRef.current == null || disabled) {
            return false;
        }
        selectRef.current.focus();
        return true;
    }, [props.name, disabled]);

    if (typeof ref === 'function') {
        ref(selectRef.current);
    } else if (typeof ref === 'object' && ref != null) {
        (ref as React.MutableRefObject<HTMLSelectElement | null>).current = selectRef.current;
    }

    useFocusable(props.name, focus);

    return <select {...props} ref={selectRef} />;
});

type TextAreaProps = JSX.IntrinsicElements['textarea'] & TabbableProps;
export const TextArea = React.forwardRef((props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const disabled = props.disabled || false;

    const focus = React.useCallback(() => {
        if (textAreaRef.current == null || disabled) {
            return false;
        }
        textAreaRef.current.focus();
        return true;
    }, [props.name, disabled]);

    if (typeof ref === 'function') {
        ref(textAreaRef.current);
    } else if (typeof ref === 'object' && ref != null) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = textAreaRef.current;
    }

    useFocusable(props.name, focus);

    return <textarea {...props} ref={textAreaRef} />;
});
