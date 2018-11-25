import * as React from 'react';
import { FocuserOptions, TabRegistry } from '../TabRegistry';
import { ArrowKey, Focuser, NavigationKey } from './Focuser';
import { NavigationContext } from './TabBoundary';

export interface Props {
    className?: string;
    disabled?: boolean;
    label: string;
    onArrowKeys?: (label: string, arrowKey: ArrowKey) => void;
    onDelete?: () => void;
    onEditStart?: (stopEditing: () => void) => void;
    onEditStop?: () => void;
    onNavigationKeys?: (label: string, navKey: NavigationKey) => void;
    onSubmit: (
        stopEditing: (preventFocus?: boolean) => void,
        submittedOn: 'blur' | 'click-outside' | 'enter-key',
    ) => void;
    renderEditor: (isEditing: boolean, stopEditing: () => void) => JSX.Element | null | false;
    submitOnBlur?: true;
    submitOnClickOutside?: true;
}
interface State {
    isEditing: boolean;
}

export class Field extends React.Component<Props, State> {
    private refContainer: HTMLDivElement | null = null;
    private refFocuser: Focuser | null = null;
    private tabRegistry: TabRegistry<string> | null = null;

    public static defaultProps = {
        disabled: false,
    };

    public constructor(props: Props) {
        super(props);
        this.state = {
            isEditing: false,
        };
    }

    public componentDidMount() {
        document.addEventListener('click', this.clickOutside, false);
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (!this.props.disabled && nextProps.disabled) {
            this.stopEditing(true);
        }
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

    private onEscape = () => {
        if (this.state.isEditing) {
            this.stopEditing();
        } else {
            if (this.tabRegistry != null) {
                this.tabRegistry.focusParent();
            }
        }
    };

    private onFieldKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.props.disabled) {
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

    private renderWithTabRegistry = (tabRegistry: TabRegistry<string> | null) => {
        this.tabRegistry = tabRegistry;
        return (
            <div
                className={this.props.className || 'field-container'}
                onClick={this.onContainerClick}
                ref={this.setContainerRef}
            >
                <Focuser
                    disabled={this.props.disabled}
                    focusKey={this.props.label}
                    key="focuser"
                    onArrowKeys={this.props.onArrowKeys}
                    onDelete={this.props.onDelete}
                    onEnter={this.startEditing}
                    onEscape={this.onEscape}
                    onNavigationKeys={this.props.onNavigationKeys}
                    onSpace={this.startEditing}
                    ref={this.setFocuserRef}
                />
                <div className="field" onBlur={this.onBlur} onClick={this.onClick} onKeyDown={this.onFieldKeyDown}>
                    <label onClick={this.onLabelClick}>{this.props.label}</label>
                    {this.props.renderEditor(this.state.isEditing, this.stopEditing)}
                </div>
            </div>
        );
    };

    public render() {
        return <NavigationContext.Consumer>{this.renderWithTabRegistry}</NavigationContext.Consumer>;
    }
}
