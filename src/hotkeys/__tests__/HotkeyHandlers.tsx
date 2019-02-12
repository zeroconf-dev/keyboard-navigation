import React from 'react';
import { fireEvent, render } from 'react-testing-library';
import { expectInstanceOf } from '../../components/__tests__/__helpers__/assert';
import { Input } from '../../components/Tabbable';
import { createHandler, HotKeysObject } from '../createHandler';

describe('Handlers', () => {
    test('non-strict', () => {
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

        expect(f).toHaveBeenCalled();

        fireEvent.keyDown(input, {
            ctrlKey: true,
            key: 'f',
        });

        expect(ctrlF).toHaveBeenCalled();
        expect(f).toHaveBeenCalledTimes(2);
    });

    test('strict', () => {
        const f = jest.fn();
        const ctrlF = jest.fn();

        const onKeyDown = createHandler({
            '!ctrl+f': ctrlF,
            '!f': f,
        });

        const { container } = render(<Input name="input" onKeyDown={onKeyDown} />);
        const input = expectInstanceOf(container.firstElementChild, HTMLInputElement);

        fireEvent.keyDown(input, {
            key: 'f',
        });

        expect(f).toHaveBeenCalled();

        fireEvent.keyDown(input, {
            ctrlKey: true,
            key: 'f',
        });

        expect(ctrlF).toHaveBeenCalled();
        expect(f).toHaveBeenCalledTimes(1);
    });

    test('edge case combinations', () => {
        const handlers = {
            '!': jest.fn(),
            '!!': jest.fn(),
            '!+': jest.fn(),
            '!alt': jest.fn(),
            '!alt++': jest.fn(),
            '+': jest.fn(),
            // tslint:disable-next-line:quotemark
            alt: jest.fn(),
            'alt+!': jest.fn(),
            'alt++': jest.fn(),
        } as HotKeysObject;

        const counters = Object.keys(handlers).reduce((c, k) => ({ ...c, [k]: 0 }), {}) as {
            [K in keyof typeof handlers]: number
        };

        const onKeyDown = createHandler(handlers);

        const { container } = render(<Input name="input" onKeyDown={onKeyDown} />);
        const input = expectInstanceOf(container.firstElementChild, HTMLInputElement);

        const assertCalls = () =>
            Object.keys(handlers).forEach(k => expect(handlers[k]).toHaveBeenCalledTimes(counters[k]));

        fireEvent.keyDown(input, { key: '!' });
        counters['!']++;
        counters['!!']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: '!' });
        counters['!']++;
        counters.alt++;
        counters['alt+!']++;
        assertCalls();

        fireEvent.keyDown(input, { key: '+' });
        counters['!+']++;
        counters['+']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: '+' });
        counters['+']++;
        counters.alt++;
        counters['alt++']++;
        counters['!alt++']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, key: 'Alt' });
        counters.alt++;
        counters['!alt']++;
        assertCalls();

        fireEvent.keyDown(input, { altKey: true, ctrlKey: true, key: 'Control' });
        counters.alt++;
        assertCalls();
    });
});
