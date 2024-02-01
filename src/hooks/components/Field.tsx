import {
    ArrowKeyHandler,
    ControlProps,
    Focuser,
    FocuserRef,
    NavigationKeyHandler,
} from '@zeroconf/keyboard-navigation/hooks/components/Focuser';
import { useTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useTabRegistry';
import { FocuserOptions } from '@zeroconf/keyboard-navigation/TabRegistry';
import { spreadControlProps } from '@zeroconf/keyboard-navigation/util';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// tslint:disable:react-unused-props-and-state

export type SubmitHandler = (
    stopEditing: (preventFocus?: boolean) => void,
    submittedOn: 'blur' | 'click-outside' | 'enter-key',
) => void;

/**
 * Render prop responsible for rendering the editor / interactive part
 * when activating the field (`isEditing`).
 */
export type EditorRenderer = (isEditing: boolean, stopEditing: () => void) => JSX.Element | null | false;

/**
 * Handler when entering editor mode / activating the field.
 */
export type EditStartHandler = (stopEditing: () => void) => void;

export interface Props extends ControlProps {
    /**
     * Set the classname of the container element,
     * this makes the component compatible with most css-in-js libraries
     * like styled-components, glamor and emotion etc.
     */
    className?: string;

    /**
     * Whether or not the field is disabled; cannot be focused, start editing,
     * no navigation key events will be triggered/propagated.
     */
    disabled?: boolean;

    /**
     * If provided, the field get the className .has-error
     * added, and render the error message adjecent to editor.
     */
    errorMessage?: string | null;

    /**
     * The label of the editor, must be unique amoung siblings
     * withing a TabBoundary/TabRegistry.
     */
    label: string;

    /**
     * Called when the underlying focuser has focus and
     * the user presses down any arrow key of the keyboard.
     * @deprecated use [onNavigationKeys].
     */
    onArrowKeys?: ArrowKeyHandler;

    /**
     * Called when the underlying focuser has focus
     * and the user presses the delete key of the keyboard.
     */
    onDelete?: () => void;

    /**
     * Called just before the fields switches to edit mode.
     * This is a great place to set internal state of any input field
     * before going into edit mode.
     */
    onEditStart?: EditStartHandler;

    /**
     * Called just after the stopEditing is called, and switches back
     * to read mode.
     * This is a great place to clean up after edit more, or reset any state
     * before going back into read mode.
     */
    onEditStop?: () => void;

    /**
     * The preferred handler to use for handling all keyboard navigation in read mode.
     * Navigation in edit mode should be implemented in the editor.
     */
    onNavigationKeys?: NavigationKeyHandler;

    /**
     * Called when submitting the field. The submit handler is responsible
     * for invoking stop editing, and put the field back into read mode.
     * The handler gets passed info about how the field is submitted.
     */
    onSubmit: SubmitHandler;

    /**
     * Render prop responsible for rendering the actual editor both in read and edit mode.
     */
    renderEditor: EditorRenderer;

    /**
     * Whether or not a blur event caught on the inside the field component
     * should trigger submit.
     */
    submitOnBlur?: boolean;

    /**
     * Whether or not click-outside of the field and/or its descendant components
     * should trigger submit.
     */
    submitOnClickOutside?: boolean;
}

export const Field: React.FC<Props> = (props: Props) => {
    const disabled = props.disabled || false;
    const submitOnBlur = props.submitOnBlur || false;
    const submitOnClickOutside = props.submitOnClickOutside || false;

    const containerRef = useRef<HTMLDivElement>(null);
    const focuserRef = useRef<FocuserRef>(null);
    const focusNextRef = useRef(false);

    const tabRegistry = useTabRegistry(false);

    const [isEditing, setIsEditing] = useState(false);

    const focus = useCallback(
        (opts: FocuserOptions) => {
            if (disabled || focuserRef.current == null) {
                return false;
            }
            return focuserRef.current.focus(opts);
        },
        [disabled],
    );

    useLayoutEffect(() => {
        if (isEditing && disabled) {
            setIsEditing(false);
        }
    }, [isEditing, disabled]);

    useEffect(() => {
        if (focusNextRef.current) {
            focus({
                focusOrigin: 'user',
            });

            if (props.onEditStop != null) {
                props.onEditStop();
            }
            focusNextRef.current = false;
        }
    }, [focus, props.onEditStop, focusNextRef.current]);

    const stopEditing = useCallback(
        (preventFocus?: boolean) => {
            if (!isEditing) {
                return;
            }

            setIsEditing(false);
            if (preventFocus) {
                return;
            }

            focusNextRef.current = true;
        },
        // undefined as any,
        [isEditing, focus, props.onEditStop],
    );

    const startEditing = useCallback(() => {
        if (disabled || isEditing) {
            return;
        }

        setIsEditing(true);

        if (props.onEditStart != null) {
            props.onEditStart(stopEditing);
        }
    }, [disabled, isEditing, props.onEditStart, stopEditing]);

    const clickOutside = useCallback(
        (e: MouseEvent) => {
            if (
                isEditing &&
                submitOnClickOutside &&
                containerRef.current != null &&
                !containerRef.current.contains(e.target as HTMLElement)
            ) {
                props.onSubmit(stopEditing, 'click-outside');
            }
        },
        [isEditing, submitOnClickOutside, props.onSubmit, stopEditing],
    );

    useLayoutEffect(() => {
        document.addEventListener('click', clickOutside, false);
        return () => {
            document.removeEventListener('click', clickOutside, false);
        };
    }, [clickOutside]);

    const onBlur = useCallback(
        (e: React.FocusEvent<HTMLDivElement>) => {
            // don't prevent default on blur event
            // or else the field actually won't get blurred.
            e.stopPropagation();

            if (!isEditing || !submitOnBlur) {
                return;
            }

            props.onSubmit(stopEditing, 'blur');
        },
        [isEditing, submitOnBlur, props.onSubmit, stopEditing],
    );

    const onClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            startEditing();
        },
        [startEditing],
    );

    const onContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
    }, []);

    const onEnter = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => {
            startEditing();
            if (props.onEnter != null) {
                props.onEnter(e, focusKey);
            }
        },
        [startEditing, props.onEnter],
    );

    const onEscape = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => {
            if (props.onEscape != null) {
                props.onEscape(e, focusKey);
            }
            if (isEditing) {
                stopEditing();
            } else {
                if (tabRegistry != null) {
                    tabRegistry.focusParent();
                }
            }
        },
        [props.onEscape, isEditing, stopEditing, tabRegistry],
    );

    const onFieldKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (disabled) {
                return;
            }

            const modifier = e.shiftKey || e.metaKey || e.ctrlKey || e.altKey;
            if (e.key === 'Enter' && !modifier) {
                e.preventDefault();
                e.stopPropagation();
                props.onSubmit(stopEditing, 'enter-key');
            } else if (e.key === 'Escape' && !modifier) {
                e.preventDefault();
                e.stopPropagation();
                stopEditing();
            }
        },
        [disabled, props.onSubmit, startEditing],
    );

    const onLabelClick = useCallback(
        (e: React.MouseEvent<HTMLLabelElement>) => {
            e.preventDefault();
            e.stopPropagation();

            focus({ focusOrigin: 'mouse' });
        },
        [focus],
    );

    const onSpace = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => {
            startEditing();
            if (props.onSpace != null) {
                props.onSpace(e, focusKey);
            }
        },
        [startEditing, props.onSpace],
    );

    return (
        <div className={props.className || 'field-container'} onClick={onContainerClick} ref={containerRef}>
            <Focuser
                focusKey={props.label}
                key="focuser"
                {...spreadControlProps(props)}
                onEnter={onEnter}
                onEscape={onEscape}
                onSpace={onSpace}
                ref={focuserRef}
            />
            <div
                className={'field' + (props.errorMessage == null ? '' : ' has-error')}
                onBlur={onBlur}
                onClick={onClick}
                onKeyDown={onFieldKeyDown}
            >
                <label onClick={onLabelClick}>{props.label}</label>
                {props.renderEditor(isEditing, stopEditing)}
                {props.errorMessage == null ? null : <div className="error-message">{props.errorMessage}</div>}
            </div>
        </div>
    );
};
