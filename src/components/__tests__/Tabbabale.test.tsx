import { render } from '@testing-library/react';
import { Input } from '@zeroconf/keyboard-navigation/components/Tabbable';
import { TabBoundary } from '@zeroconf/keyboard-navigation/components/TabBoundary';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/helpers/assert';
import { TabRegistry } from '@zeroconf/keyboard-navigation/TabRegistry';
import * as React from 'react';

describe('Tabbable', () => {
    test('can change name between renders', () => {
        const tabRegistryRef = React.createRef<TabRegistry>();
        const { rerender } = render(
            <TabBoundary tabRegistryRef={tabRegistryRef}>
                <Input name="input1" />
            </TabBoundary>,
        );

        const tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);
        expect(tabRegistry.has('input1')).toBe(true);
        expect(tabRegistry.has('input2')).toBe(false);

        rerender(
            <TabBoundary tabRegistryRef={tabRegistryRef}>
                <Input name="input2" />
            </TabBoundary>,
        );
        expect(tabRegistry.has('input1')).toBe(false);
        expect(tabRegistry.has('input2')).toBe(true);
    });

    test('can be focused', () => {
        const onFocus = jest.fn();
        const tabRegistryRef = React.createRef<TabRegistry>();
        render(
            <TabBoundary tabRegistryRef={tabRegistryRef}>
                <Input name="input1" onFocus={onFocus} />
            </TabBoundary>,
        );

        const tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);
        tabRegistry.focus('input1');

        expect(onFocus).toHaveBeenCalled();
    });

    test('cannot gain focus when disabled', () => {
        const onFocus = jest.fn();
        const tabRegistryRef = React.createRef<TabRegistry>();
        render(
            <TabBoundary tabRegistryRef={tabRegistryRef}>
                <Input disabled={true} name="input1" onFocus={onFocus} />
            </TabBoundary>,
        );

        const tabRegistry = expectInstanceOf(tabRegistryRef.current, TabRegistry);
        tabRegistry.focus('input1');

        expect(onFocus).not.toHaveBeenCalled();
    });
});
