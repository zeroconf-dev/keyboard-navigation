import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { useTabRegistry, Button, FocuserOptions } from '@zeroconf/keyboard-navigation/hooks';
import { TabBoundary } from '@zeroconf/keyboard-navigation/hooks/components/TabBoundary';
import { FocuserFn } from '@zeroconf/keyboard-navigation/TabRegistry';
import * as React from 'react';
import { useCallback, useLayoutEffect, useRef } from 'react';

const styles: { [key: string]: React.CSSProperties } = {
    button: {
        boxSizing: 'border-box',
        margin: 10,
    },
    card: {
        border: '1px solid #aaa',
        borderRadius: 5,
        boxSizing: 'border-box',
        color: '#666',
        height: 150,
        margin: 10,
        padding: 10,
        width: 400,
    },
};

const useFocusable = (
    focusKey: string | undefined,
    ref: React.RefObject<{ focus: FocuserFn } | HTMLElement>,
    autoFocus?: boolean,
) => {
    const focus = useCallback((e?: FocuserOptions) => {
        if (ref.current != null) {
            const res = ref.current.focus(e as FocuserOptions);
            return res === undefined ? true : res;
        }
        return false;
    }, []);
    const tabRegistry = useTabRegistry();

    useLayoutEffect(() => {
        if (tabRegistry != null) {
            tabRegistry.add(focusKey, focus as any);
            return () => tabRegistry.delete(focusKey);
        }
        return;
    }, [tabRegistry, focusKey, focus]);

    useLayoutEffect(() => {
        if (tabRegistry != null && autoFocus) {
            tabRegistry.focus(focusKey);
        }
    }, [tabRegistry, focusKey, autoFocus]);

    return {
        'data-focuskey': focusKey,
        ref: ref,
        tabIndex: -1,
    } as React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
};

interface CardProps {
    autoFocus?: boolean;
    focusKey: string;
    onFocus?: React.FocusEventHandler<HTMLDivElement>;
}
const Card: React.FC<CardProps> = props => {
    const ref = useRef<HTMLDivElement>(null);
    const p = useFocusable(props.focusKey, ref, props.autoFocus);
    return (
        <div {...p} onFocus={props.onFocus} ref={ref} style={styles.card}>
            {props.children}
        </div>
    );
};

interface FocusOnClickProps {
    focusKey: string;
}
const FocusOnClick: React.FC<FocusOnClickProps> = props => {
    const tabRegistry = useTabRegistry();
    const onClick = useCallback(() => {
        if (tabRegistry != null) {
            tabRegistry.focus(props.focusKey);
        }
    }, [tabRegistry, props.focusKey]);
    return (
        <Button name="focus-card" onClick={onClick} style={styles.button}>
            {props.children}
        </Button>
    );
};

storiesOf('hooks/useFocusable', module)
    .add('card is focusable', () => (
        <TabBoundary>
            <Card focusKey="dummy">This card is focusable.</Card>
        </TabBoundary>
    ))
    .add('with onFocus action', () => (
        <TabBoundary>
            <Card focusKey="dummy" onFocus={action('focus')}>
                Focus action
            </Card>
        </TabBoundary>
    ))
    .add('with autoFocus', () => (
        <TabBoundary>
            <Card autoFocus={true} focusKey="auto-focus">
                This is card automatically gains focus on mount.
            </Card>
        </TabBoundary>
    ))
    .add('navigating between fields', () => (
        <TabBoundary>
            <Card autoFocus={true} focusKey="field1">
                Press 'Tab' to focus next card.
            </Card>
            <Card focusKey="field2">Press 'Shift + Tab' to focus previous card.</Card>
        </TabBoundary>
    ))
    .add('programtically focus card', () => (
        <TabBoundary>
            <Card focusKey="card" onFocus={action('focused')}>
                Click the button to focus card.
            </Card>
            <FocusOnClick focusKey="card">Focus card above</FocusOnClick>
        </TabBoundary>
    ));
