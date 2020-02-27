import { useFocusable } from '@zeroconf/keyboard-navigation/hooks/useFocusable';
import React, { forwardRef, useRef, useCallback, useEffect } from 'react';

export interface TabbableProps {
    name: string;
}

type ButtonProps = JSX.IntrinsicElements['button'] & TabbableProps;
export const Button = forwardRef((props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const disabled = props.disabled || false;

    const focus = useCallback(() => {
        if (buttonRef.current == null || disabled) {
            return false;
        }
        buttonRef.current.focus();
        return true;
    }, [props.name, disabled]);

    useEffect(() => {
        if (typeof ref === 'function') {
            ref(buttonRef.current);
            return () => {
                ref(null);
            };
        } else if (typeof ref === 'object' && ref != null) {
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current = buttonRef.current;
            return () => {
                (ref as React.MutableRefObject<HTMLButtonElement | null>).current = null;
            };
        }
        return;
    }, [buttonRef.current]);

    useFocusable(props.name, focus);

    return <button {...props} ref={buttonRef} />;
});

Button.displayName = 'Button';

type InputProps = JSX.IntrinsicElements['input'] & TabbableProps;
export const Input = forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const disabled = props.disabled || false;

    const focus = useCallback(() => {
        if (inputRef.current == null || disabled) {
            return false;
        }
        inputRef.current.focus();
        return true;
    }, [props.name, disabled]);

    useEffect(() => {
        if (typeof ref === 'function') {
            ref(inputRef.current);
            return () => ref(null);
        } else if (typeof ref === 'object' && ref != null) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = inputRef.current;
            return () => {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = null;
            };
        }
        return;
    }, [ref]);

    useFocusable(props.name, focus);

    return <input {...props} ref={inputRef} />;
});

Input.displayName = 'Input';

type SelectProps = JSX.IntrinsicElements['select'] & TabbableProps;
export const Select = forwardRef((props: SelectProps, ref: React.Ref<HTMLSelectElement>) => {
    const selectRef = useRef<HTMLSelectElement>(null);
    const disabled = props.disabled || false;

    const focus = useCallback(() => {
        if (selectRef.current == null || disabled) {
            return false;
        }
        selectRef.current.focus();
        return true;
    }, [props.name, disabled]);

    useEffect(() => {
        if (typeof ref === 'function') {
            ref(selectRef.current);
            return () => ref(null);
        } else if (typeof ref === 'object' && ref != null) {
            (ref as React.MutableRefObject<HTMLSelectElement | null>).current = selectRef.current;
            return () => {
                (ref as React.MutableRefObject<HTMLSelectElement | null>).current = null;
            };
        }
        return;
    }, [ref]);

    useFocusable(props.name, focus);

    return <select {...props} ref={selectRef} />;
});

Select.displayName = 'Select';

type TextAreaProps = JSX.IntrinsicElements['textarea'] & TabbableProps;
export const TextArea = forwardRef((props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const disabled = props.disabled || false;

    const focus = useCallback(() => {
        if (textAreaRef.current == null || disabled) {
            return false;
        }
        textAreaRef.current.focus();
        return true;
    }, [props.name, disabled]);

    useEffect(() => {
        if (typeof ref === 'function') {
            ref(textAreaRef.current);
            return () => ref(null);
        } else if (typeof ref === 'object' && ref != null) {
            (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = textAreaRef.current;
            return () => {
                (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = null;
            };
        }
        return;
    });

    useFocusable(props.name, focus);

    return <textarea {...props} ref={textAreaRef} />;
});

TextArea.displayName = 'TextArea';
