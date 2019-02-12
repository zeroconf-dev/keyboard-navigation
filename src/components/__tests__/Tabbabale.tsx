import React from 'react';
import { render } from 'react-testing-library';
import { TabRegistry } from '../../TabRegistry';
import { Input } from '../Tabbable';
import { TabBoundary } from '../TabBoundary';
import { expectInstanceOf } from './__helpers__/assert';

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
