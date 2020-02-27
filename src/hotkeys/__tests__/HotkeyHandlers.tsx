import { fireEvent, render } from '@testing-library/react';
import { Input } from '@zeroconf/keyboard-navigation/hooks/components/Tabbable';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/__helpers__/assert';
import { createHandler, HotkeysObject } from '@zeroconf/keyboard-navigation/hotkeys/createHandler';
import * as React from 'react';

describe('Handlers', () => {
    test('non-strict', () => {
        const f = jest.fn();
        const ctrlF = jest.fn();

        const onKeyDown = createHandler({
            '!ctrl+f': ctrlF,
            f: f,
        });

        const { container } = render(<Input name="input" onKeyDown={onKeyDown} />);
        const input = expectInstanceOf(container.firstElementChild, HTMLInputElement);

        fireEvent.keyDown(input, {
            key: 'f',
        });

        expect(f).not.toHaveBeenCalled();

        fireEvent.keyDown(input, {
            ctrlKey: true,
            key: 'f',
        });

        expect(ctrlF).toHaveBeenCalled();
        expect(f).not.toHaveBeenCalled();
    });

    test('strict', () => {
        const f = jest.fn();
        const ctrlF = jest.fn();

        const onKeyDown = createHandler({
            'ctrl+f': ctrlF,
            f: f,
        });

        const { container } = render(<Input name="input" onKeyDown={onKeyDown} />);
        const input = expectInstanceOf(container.firstElementChild, HTMLInputElement);

        fireEvent.keyDown(input, {
            key: 'f',
        });

        expect(f).not.toHaveBeenCalled();

        fireEvent.keyDown(input, {
            ctrlKey: true,
            key: 'f',
        });

        expect(ctrlF).toHaveBeenCalled();
        expect(f).not.toHaveBeenCalled();
    });

    test('edge case combinations for native input element', () => {
        const handlers = {
            '!': jest.fn(),
            '!!': jest.fn(),
            '!+': jest.fn(),
            '!alt': jest.fn(),
            '!alt++': jest.fn(),
            '+': jest.fn(),
            alt: jest.fn(),
            'alt+!': jest.fn(),
            'alt++': jest.fn(),
        } as HotkeysObject;

        const counters = Object.keys(handlers).reduce((c, k) => ({ ...c, [k]: 0 }), {}) as {
            [K in keyof typeof handlers]: number;
        };

        const onKeyDown = createHandler(handlers);

        const { container } = render(<Input name="input" onKeyDown={onKeyDown as any} />);
        const input = expectInstanceOf(container.firstElementChild, HTMLInputElement);

        const assertCalls = () =>
            Object.keys(handlers).forEach(k => expect(handlers[k]).toHaveBeenCalledTimes(counters[k]));

        fireEvent.keyDown(input, { key: '!' });
        // counters['!']++;
        // counters['!!']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: '!' });
        counters['!!']++;
        counters['!alt']++;
        counters['alt+!']++;
        assertCalls();

        fireEvent.keyDown(input, { key: '+' });
        // counters['!+']++;
        // counters['+']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: '+' });
        counters['!+']++;
        counters['!alt']++;
        counters['!alt++']++;
        counters['alt++']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: 'Alt' });
        counters.alt++;
        counters['!alt']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, ctrlKey: true, key: 'Control' });
        counters['!alt']++;
        assertCalls();
    });

    test('edge case combinations for non-native input element', () => {
        const handlers = {
            '!': jest.fn(),
            '!!': jest.fn(),
            '!+': jest.fn(),
            '!alt': jest.fn(),
            '!alt++': jest.fn(),
            '+': jest.fn(),
            alt: jest.fn(),
            'alt+!': jest.fn(),
            'alt++': jest.fn(),
        } as HotkeysObject;

        const counters = Object.keys(handlers).reduce((c, k) => ({ ...c, [k]: 0 }), {}) as {
            [K in keyof typeof handlers]: number;
        };

        const onKeyDown = createHandler(handlers);

        const { container } = render(<div tabIndex={-1} onKeyDown={onKeyDown as any} />);
        const input = expectInstanceOf(container.firstElementChild, HTMLDivElement);

        const assertCalls = () =>
            Object.keys(handlers).forEach(k => expect(handlers[k]).toHaveBeenCalledTimes(counters[k]));

        fireEvent.keyDown(input, { key: '!' });
        counters['!']++;
        counters['!!']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: '!' });
        counters['!!']++;
        counters['!alt']++;
        counters['alt+!']++;
        assertCalls();

        fireEvent.keyDown(input, { key: '+' });
        counters['!+']++;
        counters['+']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: '+' });
        counters['!+']++;
        counters['!alt']++;
        counters['!alt++']++;
        counters['alt++']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: 'Alt' });
        counters.alt++;
        counters['!alt']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, ctrlKey: true, key: 'Control' });
        counters['!alt']++;
        assertCalls();
    });
});
