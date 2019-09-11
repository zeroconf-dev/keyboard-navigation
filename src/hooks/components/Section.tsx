import {
    ControlProps,
    Focuser,
    FocuserRef,
    ModifierKeys,
    NavigationKey,
    NavigationKeyHandler,
} from '@zeroconf/keyboard-navigation/hooks/components/Focuser';
import { TabBoundary } from '@zeroconf/keyboard-navigation/hooks/components/TabBoundary';
import { useTabRegistry } from '@zeroconf/keyboard-navigation/hooks/useTabRegistry';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import {
    assertNeverNonThrow,
    filterPropKeys,
    isNativeFocusable,
    spreadControlProps,
    UnpackedHTMLAttributes,
} from '@zeroconf/keyboard-navigation/util';
import * as React from 'react';

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
    tabRegistryRef?: React.RefObject<TabRegistry<string>>;
}

export type Props<TComp extends keyof JSX.IntrinsicElements> = UnpackedHTMLAttributes<TComp> & ComponentProps<TComp>;

const filterProps = <TComp extends keyof JSX.IntrinsicElements>(propKey: keyof ComponentProps<TComp>) => {
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
        case 'tabRegistryRef':
            return false;
        default:
            assertNeverNonThrow(propKey);
            return true;
    }
};

export const Section = <TComp extends keyof JSX.IntrinsicElements>(props: Props<TComp>) => {
    const boundaryProps = filterPropKeys<ComponentProps<TComp>, TComp, Props<TComp>>(props, filterProps);
    const focuserRef = React.useRef<FocuserRef>(null);
    const focusOnClick = props.focusOnClick == null ? 'section' : props.focusOnClick;
    const tabRegistry = useTabRegistry();
    let tabRegistryRef = React.useRef<TabRegistry<string>>(null);
    if (props.tabRegistryRef != null) {
        tabRegistryRef = props.tabRegistryRef;
    }

    const navHandler = React.useCallback(
        (_: string, navKey: NavigationKey, modifierKeys: ModifierKeys) => {
            if (props.navigationHandler != null) {
                props.navigationHandler(props.focusKey, navKey, modifierKeys);
            }
        },
        [props.navigationHandler, props.focusKey],
    );
    const navigationHandler = props.navigationHandler == null ? undefined : navHandler;

    const onClick = React.useCallback(
        (e: React.MouseEvent<any>) => {
            if (isNativeFocusable(e.target)) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (focusOnClick !== false) {
                const boundaryRegistry = (focusOnClick !== 'section' && tabRegistryRef.current) || null;

                switch (focusOnClick) {
                    case 'section':
                        if (focuserRef.current != null) {
                            focuserRef.current.focus({
                                focusOrigin: 'mouse',
                            });
                        }
                        break;
                    case 'first-child':
                        if (boundaryRegistry != null) {
                            boundaryRegistry.focusFirst();
                        }
                        break;
                    case 'last-child':
                        if (boundaryRegistry != null) {
                            boundaryRegistry.focusLast();
                        }
                        break;
                    default:
                        if (boundaryRegistry != null) {
                            boundaryRegistry.focus(focusOnClick);
                        }
                        break;
                }

                if (props.onClick != null) {
                    props.onClick(e);
                }
            }
        },
        [focusOnClick, props.onClick],
    );

    const onEnterKey = React.useCallback(() => {
        if (tabRegistry != null) {
            tabRegistry.focusIn([props.focusKey, props.focusKey + '-section'], {
                focusOrigin: 'parent',
            });
        }
    }, [tabRegistry, props.focusKey]);

    const onEscapeKey = React.useCallback(() => {
        if (tabRegistry != null) {
            const reg = tabRegistry.get(props.focusKey);
            if (reg instanceof TabRegistry) {
                reg.focusParent();
            }
        }
    }, [tabRegistry, props.focusKey]);

    return (
        <TabBoundary
            className={props.className || 'section-container'}
            {...boundaryProps}
            as={props.as}
            boundaryKey={props.focusKey}
            focusFirstOnNextOrigin={true}
            onClick={onClick}
        >
            <Focuser
                {...spreadControlProps(props)}
                focusKey={props.focusKey}
                onEnter={onEnterKey}
                onEscape={onEscapeKey}
                onNavigationKeys={navigationHandler}
                ref={focuserRef}
            />
            <TabBoundary
                boundaryKey={props.focusKey + '-section'}
                className="section"
                cycle={props.cycle}
                focusParentOnChildOrigin={true}
                focusParentOnEscape={true}
                tabRegistryRef={tabRegistryRef}
            >
                {props.children}
            </TabBoundary>
        </TabBoundary>
    );
};
