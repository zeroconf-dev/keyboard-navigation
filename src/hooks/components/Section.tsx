import * as React from 'react';
import { useCallback, useRef } from 'react';
import { TabRegistry } from '../../TabRegistry';
import { assertNeverNonThrow, filterPropKeys, spreadControlProps, UnpackedHTMLAttributes } from '../../util';
import { ControlProps, Focuser, FocuserRef, ModifierKeys, NavigationKey, NavigationKeyHandler } from './Focuser';
import { TabBoundary } from './TabBoundary';

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
    const focuserRef = useRef<FocuserRef>(null);
    const focusOnClick = props.focusOnClick == null ? 'section' : props.focusOnClick;
    let tabRegistryRef = useRef<TabRegistry<string>>(null);
    if (props.tabRegistryRef != null) {
        tabRegistryRef = props.tabRegistryRef;
    }

    const navHandler = useCallback(
        (_: string, navKey: NavigationKey, modifierKeys: ModifierKeys) => {
            if (props.navigationHandler != null) {
                props.navigationHandler(props.focusKey, navKey, modifierKeys);
            }
        },
        [props.navigationHandler, props.focusKey],
    );
    const navigationHandler = props.navigationHandler == null ? undefined : navHandler;

    const onClick = useCallback(
        (e: React.MouseEvent<any>) => {
            e.preventDefault();
            e.stopPropagation();

            if (focusOnClick !== false) {
                const tabRegistry = (focusOnClick !== 'section' && tabRegistryRef.current) || null;

                switch (focusOnClick) {
                    case 'section':
                        if (focuserRef.current != null) {
                            focuserRef.current.focus({
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
                            tabRegistry.focus(focusOnClick);
                        }
                        break;
                }

                if (props.onClick != null) {
                    props.onClick(e);
                }
            }
        },
        [tabRegistryRef, focusOnClick, props.onClick],
    );

    const onEnterKey = useCallback(
        () => {
            if (tabRegistryRef.current != null) {
                tabRegistryRef.current.focus(undefined, {
                    focusOrigin: 'parent',
                });
            }
        },
        [tabRegistryRef],
    );

    const onEscapeKey = useCallback(
        () => {
            if (tabRegistryRef.current != null) {
                const reg = tabRegistryRef.current.get(props.focusKey);
                if (reg instanceof TabRegistry) {
                    reg.focusParent();
                }
            }
        },
        [tabRegistryRef, props.focusKey],
    );

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
