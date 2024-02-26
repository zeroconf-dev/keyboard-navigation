import { useTabRegistry } from "@zeroconf/keyboard-navigation/hooks";
import { HotkeyHandler } from "@zeroconf/keyboard-navigation/hotkeys/HotkeyRegistry";
import {TabBoundary, GlobalHotkeyBoundary, HotkeyLegend as HotkeyLegendBase, NavigationMap, Hotkey, HotkeyBoundary } from "@zeroconf/keyboard-navigation/hotkeys/components";
import { hotkeyToText } from "@zeroconf/keyboard-navigation/hotkeys/components/__tests__/helpers/hotkeyToText";
import { HotkeyObject } from "@zeroconf/keyboard-navigation/hotkeys/parser";
import { useCallback, useEffect, useRef } from "react";


const useFocusable = (
    focusKey: string | undefined,
    ref: React.RefObject<{ focus: FocuserFn } | HTMLElement>,
    autoFocus?: boolean,
) => {
    const focus = useCallback((e?: FocuserOptions) => {
        if (ref.current != null) {
            if (ref.current instanceof HTMLElement) {
                ref.current.focus();
                return true;
            } else {
                return ref.current.focus(e ?? { focusOrigin: 'none' });
            }
        }
        return false;
    }, []);
    const tabRegistry = useTabRegistry();

    useEffect(() => {
        if (tabRegistry != null && focusKey) {
            tabRegistry.add(focusKey, focus);
            return () => tabRegistry.delete(focusKey);
        }
        return;
    }, [tabRegistry, focusKey, focus]);

    useEffect(() => {
        if (tabRegistry != null && autoFocus) {
            tabRegistry.focus(focusKey);
        }
    }, []);

    return {
        'data-focuskey': focusKey,
        ref: ref,
        tabIndex: 0,
    } as React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
};

const renderHotkey = (hotkey: HotkeyObject) => {
    const text = hotkeyToText(hotkey);
    return (
        <div className="border px-1 py-0.5 rounded-md border border-gray-700" key={text}>{text}</div>
    )
};

const sidebarLinks = [
    {
        name: 'Home',
        href: '/',
        hotkey: 'H'
    },
    {
        name: 'My profile',
        href: '/profile',
        hotkey: 'P'
    },
    {
        name: 'Projects',
        href: '/projects',
        hotkey: null,
    },
    {
        name: 'Dashboard',
        href: '/dashboard',
        hotkey: 'D',
    },
    {
        name: 'Forum',
        href: '/forum',
        hotkey: 'F',
    },
] as const;

const SidebarLink = ({ name, href, hotkey }: typeof sidebarLinks[number]) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const focusable = useFocusable(name, ref);
    const navigate = useCallback(() => {
        if (ref.current == null) {
            return false;
        } else {
            ref.current.click();
            return true
        }
    }, []);

    const hotkeyComponent =
        hotkey == null ? null : (
            <>
                <span className="group-focus-within:block max-h-1m hidden bg-gray-200 py-1 px-2 rounded-md">{hotkey}</span>
                <Hotkey hotkey={hotkey} handler={navigate} />
            </>
        );

    return (
        <li>
            <a
                {...focusable}
                className="py-2 px-4 h-12 items-center block hover:bg-gray-100 focus:bg-gray-100 outline-none flex justify-between" 
                href={href}
                ref={ref}
            >
                <span>{name}</span>
                {hotkeyComponent}
            </a>
        </li>
    );
};

const navigationMap = sidebarLinks.map((link) => [link.name]) satisfies [string][];
const Mainmenu = () => {
    const focusMainContent = useCallback<HotkeyHandler>(({ tabRegistry }) => {
        return tabRegistry?.parentRegistry?.focus('main') ?? false;
    }, []);
    const focusMainmenu = useCallback<HotkeyHandler>(({ tabRegistry }) => {
        return tabRegistry?.focus('mainmenu') ?? false;
    }, []);
    return (
        <>
            <HotkeyBoundary scope="mainmenu" className="shadow-xl flex-shrink-0 basis-72 flex flex-col">
                <TabBoundary as="nav" boundaryKey="mainmenu" className="group flex-1 flex flex-col">
                    <img tabIndex={0} className="mx-4 mt-2 aspect-square w-32 self-center border-2 border-transparent outline-none focus:border-gray-300 rounded-md" src="https://img.freepik.com/premium-vector/free-vector-growth-arrow-logo-template-design_634294-291.jpg?w=826" alt="logo" />
                    <ul className="divide-y">
                        {sidebarLinks.map((link) => <SidebarLink key={link.href} {...link} />)}
                    </ul>
                    <NavigationMap navigationMap={navigationMap} tabDirectionAxis="y" />
                    <Hotkey hotkey="m" handler={focusMainContent} />
                </TabBoundary>
            </HotkeyBoundary>
            <Hotkey hotkey="m" isGlobal={true} handler={focusMainmenu} />
        </>
    );
}

const HotkeyLegend = () => {
    return (
        <div className="fixed bottom-0 right-0 max-w-full bg-gray-900/30 flex gap-1 p-4 empty:hidden">
            <HotkeyLegendBase renderHotkey={renderHotkey} />
        </div>
    );
};


const MainContent = () => {
    return (
        <TabBoundary as="main" className="outline-none border border-transparent focus:border-sky-500 flex-1 flex flex-col" boundaryKey="main" data-focuskey="main" tabIndex={0}>
            <HotkeyBoundary scope="main">
                Content <input type="text" />
            </HotkeyBoundary>
        </TabBoundary>
    );
}

export const SidebarShell = () => {
    return <GlobalHotkeyBoundary className="w-full h-full">
        <TabBoundary className="w-full h-full flex gap-1" boundaryKey="global">
            <Mainmenu />
            <MainContent />
            <HotkeyLegend />
        </TabBoundary>
    </GlobalHotkeyBoundary>;
};

SidebarShell.story = {
    title: 'Sidebar',
};


const meta = {
    title: 'App/Shell',
    component: SidebarShell,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;