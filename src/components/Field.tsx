import { ArrowKeyHandler, ControlProps, Focuser, NavigationKeyHandler } from '@zeroconf/keyboard-navigation/components/Focuser';
import { NavigationContext } from '@zeroconf/keyboard-navigation/components/NavigationContext';
import { FocuserOptions, TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import { spreadControlProps } from '@zeroconf/keyboard-navigation/util';
import * as React from 'react';

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

interface State {
    isEditing: boolean;
}

type PropsTabRegistry = Props & { tabRegistry: TabRegistry | null };

class FieldWithTabRegistry extends React.Component<PropsTabRegistry, State> {
    public static defaultProps = {
        disabled: false,
        submitOnBlur: false,
        submitOnClickOutside: false,
    };
    public static displayName = 'Field';

    private refContainer: HTMLDivElement | null = null;
    private refFocuser: Focuser | null = null;

    public constructor(props: PropsTabRegistry) {
        super(props);
        this.state = {
            isEditing: false,
        };
    }

    public componentDidMount() {
        document.addEventListener('click', this.clickOutside, false);
    }

    public componentWillUnmount() {
        document.removeEventListener('click', this.clickOutside, false);
    }

    private clickOutside = (e: MouseEvent) => {
        if (this.state.isEditing && this.props.submitOnClickOutside) {
            if (this.refContainer != null && !this.refContainer.contains(e.target as HTMLElement)) {
                this.props.onSubmit(this.stopEditing, 'click-outside');
            }
        }
    };

    private focus(opts: FocuserOptions) {
        if (this.props.disabled || this.refFocuser == null) {
            return false;
        }
        return this.refFocuser.focus(opts);
    }

    private onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        // don't prevent default on blur event
        // or else the field actually won't get blurred.
        e.stopPropagation();

        if (!this.state.isEditing || !this.props.submitOnBlur) {
            return;
        }

        this.props.onSubmit(this.stopEditing, 'blur');
    };

    private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.startEditing();
    };

    private onContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
    };

    private onEnter = (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => {
        this.startEditing();
        if (this.props.onEnter != null) {
            this.props.onEnter(e, focusKey);
        }
    };

    private onEscape = (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => {
        if (this.props.onEscape != null) {
            this.props.onEscape(e, focusKey);
        }
        if (this.state.isEditing) {
            this.stopEditing();
        } else {
            if (this.props.tabRegistry != null) {
                this.props.tabRegistry.focusParent();
            }
        }
    };

    private onFieldKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.props.disabled || !this.state.isEditing) {
            /* istanbul ignore next */
            return;
        }

        const modifier = e.shiftKey || e.metaKey || e.ctrlKey || e.altKey;
        if (e.key === 'Enter' && !modifier) {
            e.preventDefault();
            e.stopPropagation();
            this.props.onSubmit(this.stopEditing, 'enter-key');
        } else if (e.key === 'Escape' && !modifier) {
            e.preventDefault();
            e.stopPropagation();
            this.stopEditing();
        }
    };

    private onLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();

        this.focus({
            focusOrigin: 'mouse',
        });
    };

    private onSpace = (e: React.KeyboardEvent<HTMLInputElement>, focusKey: string) => {
        this.startEditing();
        if (this.props.onSpace != null) {
            this.props.onSpace(e, focusKey);
        }
    };

    private renderErrorMessage() {
        if (this.props.errorMessage == null) {
            return null;
        }
        return <div className="error-message">{this.props.errorMessage}</div>;
    }

    private setContainerRef = (ref: HTMLDivElement | null) => {
        this.refContainer = ref;
    };

    private setFocuserRef = (ref: Focuser | null) => {
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

    public UNSAFE_componentWillReceiveProps(nextProps: PropsTabRegistry) {
        if (!this.props.disabled && nextProps.disabled) {
            this.stopEditing(true);
        }
    }

    public render() {
        return (
            <div
                className={this.props.className || 'field-container'}
                onClick={this.onContainerClick}
                ref={this.setContainerRef}
            >
                <Focuser
                    focusKey={this.props.label}
                    key="focuser"
                    {...spreadControlProps(this.props)}
                    onEnter={this.onEnter}
                    onEscape={this.onEscape}
                    onSpace={this.onSpace}
                    ref={this.setFocuserRef}
                />
                <div
                    className={'field' + (this.props.errorMessage == null ? '' : ' has-error')}
                    onBlur={this.onBlur}
                    onClick={this.onClick}
                    onKeyDown={this.onFieldKeyDown}
                >
                    <label onClick={this.onLabelClick}>{this.props.label}</label>
                    {this.props.renderEditor(this.state.isEditing, this.stopEditing)}
                    {this.renderErrorMessage()}
                </div>
            </div>
        );
    }
}

type PropsWithForwardRef = Props & { forwardedRef?: React.Ref<FieldWithTabRegistry> };
class FieldWithForwardRef extends React.Component<PropsWithForwardRef> {
    public static displayName = 'TabRegistry(Field)';

    private renderChildren = (tabRegistry: TabRegistry | null) => {
        const { forwardedRef, ...props } = this.props;
        return <FieldWithTabRegistry {...props} ref={forwardedRef} tabRegistry={tabRegistry} />;
    };

    public render() {
        return <NavigationContext.Consumer children={this.renderChildren} />;
    }
}

/**
 * Helper for creating UI which have read / edit modes
 * and helps making "fields" which can be navigated to even
 * when the UI is not built upon elements which
 * natively can be have focus.
 *
 * Focus handling, and switching between read/edit mode
 * and submitting values to persistence or cancel edit of value
 * is made easier.
 */
export type Field = FieldWithTabRegistry;
export const Field = React.forwardRef<FieldWithTabRegistry, Props>((props, ref) => (
    <FieldWithForwardRef {...props} forwardedRef={ref} />
)) as React.ComponentClass<Props> &
    React.ForwardRefExoticComponent<React.PropsWithoutRef<Props> & React.RefAttributes<FieldWithTabRegistry>>;
