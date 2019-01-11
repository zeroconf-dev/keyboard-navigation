import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, spreadControlProps, UnpackedHTMLAttributes } from '../util';
import { ControlProps, Focuser, ModifierKeys, NavigationKey, NavigationKeyHandler } from './Focuser';
import { NavigationContext, TabBoundary } from './TabBoundary';

interface ComponentProps<TComp extends keyof JSX.IntrinsicElements> extends ControlProps {
    /**
     * Specify which intrinsic / host component the section should be rendered as.
     */
    // tslint:disable-next-line:no-reserved-keywords
    as?: TComp;

    /**
     * Auto focus the section when the component is mounted.
     * It has the same behavior as the `autoFocus` prop of the
     * native input component.
     */
    autoFocus?: boolean;

    /**
     * Setting the `className` on the container component specified by
     * the `as` prop or `div` if nothing is defined.
     * This makes the component compatible with most of the CSS-in-JS libraries.
     */
    className?: string;

    /**
     * Whether or not the tab boundary should [cycle](TabBoundary#cycle) when attempting
     * to "tab over" the boundary.
     */
    cycle?: boolean;

    /**
     * Disables the section if set to true, so the section itself cannot take
     * focus. However it does not mean that the "children" of the section
     * cannot be focused.
     */
    disabled?: boolean;

    /**
     * The focus key to identify the section inside the closed ancestor boundary.
     * **Note**: it should be unique amongst its siblings of the bonudary it lives in.
     */
    focusKey: string;

    /**
     * Defined the behavior of clicking on the section.
     * The deafult is give focus to the entire `section`.
     * You can configure it to focus `first-child`, `last-child` or a specifc
     * focus key of a child.
     *
     * To disable the behavior pass `false`.
     */
    focusOnClick?: 'section' | 'first-child' | 'last-child' | string | false;

    /**
     * Optionally pass a {@link createNavigationHandler | navigation key handler},
     * for very fine-grained tab/arrow key control.
     */
    navigationHandler?: NavigationKeyHandler;

    /**
     * A
     */
    tabRegistryRef?: React.RefObject<TabRegistry>;
}

export type Props<TComp extends keyof JSX.IntrinsicElements> = UnpackedHTMLAttributes<TComp> & ComponentProps<TComp>;

type PropsWithTabRegistry<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    tabRegistry: TabRegistry | null;
};

interface State {}

class SectionWithTabRegistry<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithTabRegistry<TComp>,
    State
> {
    public static defaultProps = {
        focusOnClick: 'section',
    };

    public static displayName = 'Section';

    private refFocuser: Focuser | null = null;
    private tabRegistryRef: React.RefObject<TabRegistry>;

    public constructor(props: PropsWithTabRegistry<TComp>) {
        super(props);
        this.tabRegistryRef = props.tabRegistryRef || React.createRef();
    }

    private filterPropKeys = (propKey: keyof ComponentProps<TComp> | 'tabRegistry') => {
        switch (propKey) {
            case 'as':
            case 'autoFocus':
            case 'className':
            case 'cycle':
            case 'disabled':
            case 'focusKey':
            case 'focusOnClick':
            case 'navigationHandler':
            case 'onArrowDown':
            case 'onArrowKeys':
            case 'onArrowLeft':
            case 'onArrowRight':
            case 'onArrowUp':
            case 'onBlur':
            case 'onDelete':
            case 'onEnter':
            case 'onEscape':
            case 'onFocus':
            case 'onMinus':
            case 'onNavigationKeys':
            case 'onPlus':
            case 'onQuestionMark':
            case 'onSpace':
            case 'tabRegistry':
            case 'tabRegistryRef':
                return false;
            default:
                assertNeverNonThrow(propKey);
                return true;
        }
    };

    private navigationHandler = (_: string, navKey: NavigationKey, modifierKeys: ModifierKeys) => {
        if (this.props.navigationHandler != null) {
            this.props.navigationHandler(this.props.focusKey, navKey, modifierKeys);
        }
    };

    private onClick = (e: React.MouseEvent<any>) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.props.focusOnClick !== false) {
            // prettier-ignore
            const tabRegistry = (
                this.props.focusOnClick !== 'section' &&
                this.tabRegistryRef != null &&
                this.tabRegistryRef.current
            ) || null;

            switch (this.props.focusOnClick) {
                case 'section':
                    if (this.refFocuser != null) {
                        this.refFocuser.focus({
                            focusOrigin: 'mouse',
                        });
                    }
                    break;
                case 'first-child':
                    if (tabRegistry != null) {
                        tabRegistry.focusFirst();
                    }
                    break;
                case 'last-child':
                    if (tabRegistry != null) {
                        tabRegistry.focusLast();
                    }
                    break;
                default:
                    if (tabRegistry != null) {
                        tabRegistry.focus(this.props.focusOnClick);
                    }
                    break;
            }
        }

        if (this.props.onClick != null) {
            this.props.onClick(e);
        }
    };

    private onEnterKey = () => {
        if (this.props.tabRegistry != null) {
            this.props.tabRegistry.focusIn([this.props.focusKey, this.props.focusKey + '-section'], {
                focusOrigin: 'parent',
            });
        }
    };

    private onEscapeKey = () => {
        if (this.props.tabRegistry != null) {
            const reg = this.props.tabRegistry.get(this.props.focusKey);
            if (reg instanceof TabRegistry) {
                reg.focusParent();
            }
        }
    };

    private setFocuserRef = (ref: Focuser | null) => {
        this.refFocuser = ref;
    };

    public render() {
        const navigationHandler = this.props.navigationHandler == null ? undefined : this.navigationHandler;
        const boundaryProps = filterPropKeys<ComponentProps<TComp>, TComp, PropsWithTabRegistry<TComp>>(
            this.props,
            this.filterPropKeys,
        );
        return (
            <TabBoundary
                className={this.props.className || 'section-container'}
                {...boundaryProps}
                as={this.props.as}
                boundaryKey={this.props.focusKey}
                focusFirstOnNextOrigin={true}
                onClick={this.onClick}
            >
                <Focuser
                    {...spreadControlProps(this.props)}
                    focusKey={this.props.focusKey}
                    onEnter={this.onEnterKey}
                    onEscape={this.onEscapeKey}
                    onNavigationKeys={navigationHandler}
                    ref={this.setFocuserRef}
                />
                <TabBoundary
                    boundaryKey={this.props.focusKey + '-section'}
                    className="section"
                    cycle={this.props.cycle}
                    focusParentOnChildOrigin={true}
                    focusParentOnEscape={true}
                    tabRegistryRef={this.tabRegistryRef}
                >
                    {this.props.children}
                </TabBoundary>
            </TabBoundary>
        );
    }
}

type PropsWithForwardRef<TComp extends keyof JSX.IntrinsicElements> = Props<TComp> & {
    forwardedRef?: React.Ref<SectionWithTabRegistry<TComp>>;
};
class SectionWithForwardRef<TComp extends keyof JSX.IntrinsicElements = 'div'> extends React.Component<
    PropsWithForwardRef<TComp>
> {
    public static displayName = 'TabRegistry(Section)';

    private renderChildren = (tabRegistry: TabRegistry | null) => {
        const { forwardedRef, ...props } = this.props;
        return <SectionWithTabRegistry {...props} ref={forwardedRef} tabRegistry={tabRegistry} />;
    };

    public render() {
        return <NavigationContext.Consumer children={this.renderChildren} />;
    }
}

const forwardRef = <TComp extends keyof JSX.IntrinsicElements = 'div'>() =>
    React.forwardRef<SectionWithTabRegistry<TComp>, Props<TComp>>((props, ref) => (
        <SectionWithForwardRef {...props} forwardedRef={ref} />
    )) as React.ComponentClass<Props<TComp>> &
        React.ForwardRefExoticComponent<
            React.PropsWithoutRef<Props<TComp>> & React.RefAttributes<SectionWithTabRegistry<TComp>>
        >;

/**
 * Container component, where you can group focusable elements
 * and make it easy to navigate between other groups (`Section`).
 */
export type Section<TComp extends keyof JSX.IntrinsicElements = 'div'> = SectionWithTabRegistry<TComp>;
export const Section = forwardRef<keyof JSX.IntrinsicElements>();
