import { action } from '@storybook/addon-actions';
import { Button, TabBoundary, useTabRegistry } from '@zeroconf/keyboard-navigation/hooks';
import { FocuserFn, FocuserOptions } from '@zeroconf/keyboard-navigation/TabRegistry';
import { useCallback, useEffect, useRef } from 'react';

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
        tabIndex: -1,
    } as React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
};

interface CardProps {
    readonly autoFocus?: boolean;
    readonly children?: React.ReactNode;
    readonly focusKey: string;
    readonly onFocus?: React.FocusEventHandler<HTMLDivElement>;
}
const Card: React.FC<CardProps> = (props) => {
    const ref = useRef<HTMLDivElement>(null);
    const p = useFocusable(props.focusKey, ref, props.autoFocus);
    return (
        <div
            {...p}
            className="m-3 h-40 w-96 cursor-pointer rounded-md border border-gray-300 p-3 text-gray-500 outline-none focus:border-red-500 active:bg-zinc-200"
            onFocus={props.onFocus}
            ref={ref}
        >
            {props.children}
        </div>
    );
};

interface FocusOnClickProps {
    readonly autoFocus?: boolean;
    readonly children?: React.ReactNode;
    readonly focusKey: string;
}
const FocusOnClick: React.FC<FocusOnClickProps> = (props) => {
    const tabRegistry = useTabRegistry();
    const onClick = useCallback(() => {
        if (tabRegistry != null) {
            tabRegistry.focus(props.focusKey);
        }
    }, [tabRegistry, props.focusKey]);
    return (
        <Button
            autoFocus={props.autoFocus}
            className="m-3 box-border rounded-md border border-zinc-800 p-2 outline-none focus:border-red-500 active:bg-zinc-200"
            name="focus-card"
            onClick={onClick}
        >
            {props.children}
        </Button>
    );
};

export default {
    title: 'Hooks/useFocusable',
};

export const CardIsFocusable = () => (
    <TabBoundary>
        <Card focusKey="dummy">This card is focusable.</Card>
    </TabBoundary>
);

CardIsFocusable.story = {
    name: 'card is focusable',
};

export const WithOnFocusAction = () => (
    <TabBoundary>
        <Card focusKey="dummy" onFocus={action('focus')}>
            Focus action
        </Card>
    </TabBoundary>
);

WithOnFocusAction.story = {
    name: 'with onFocus action',
};

export const WithAutoFocus = () => (
    <TabBoundary>
        <Card autoFocus={true} focusKey="auto-focus">
            This is card automatically gains focus on mount.
        </Card>
    </TabBoundary>
);

WithAutoFocus.story = {
    name: 'with autoFocus',
};

export const NavigatingBetweenFields = () => (
    <TabBoundary>
        <Card autoFocus={true} focusKey="field1">
            Press &apos;Tab&apos; to focus next card.
        </Card>
        <Card focusKey="field2">Press &apos;Shift + Tab&apos; to focus previous card.</Card>
    </TabBoundary>
);

NavigatingBetweenFields.story = {
    name: 'navigating between fields',
};

export const ProgramticallyFocusCard = () => (
    <TabBoundary>
        <Card focusKey="card" onFocus={action('focused')}>
            Click the button to focus card.
        </Card>
        <FocusOnClick autoFocus={true} focusKey="card">
            Focus card above
        </FocusOnClick>
    </TabBoundary>
);

ProgramticallyFocusCard.story = {
    name: 'programtically focus card',
};
