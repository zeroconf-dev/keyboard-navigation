import * as React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { Field } from '../Field';

describe('Activate field', () => {
    afterEach(cleanup);
    test('click on field enables editing', () => {
        const onSubmit = jest.fn();
        const renderEditor = (isEditing: boolean) => {
            return <div data-testid="editor">{isEditing ? 'edit' : 'read'}</div>;
        };
        const { getByTestId, container } = render(
            <Field label="field" onSubmit={onSubmit} renderEditor={renderEditor} />,
        );

        const field = container.querySelector('.field') as HTMLElement;
        const editor = getByTestId('editor');

        expect(editor.textContent).toBe('read');
        fireEvent.click(field);
        expect(editor.textContent).toBe('edit');
    });

    test('click on disabled field not enables editing', () => {
        const onSubmit = jest.fn();
        const renderEditor = (isEditing: boolean) => {
            return <div data-testid="editor">{isEditing ? 'edit' : 'read'}</div>;
        };
        const { getByTestId, container } = render(
            <Field disabled={true} label="field" onSubmit={onSubmit} renderEditor={renderEditor} />,
        );

        const field = container.querySelector('.field') as HTMLElement;
        const editor = getByTestId('editor');

        expect(editor.textContent).toBe('read');
        fireEvent.click(field);
        expect(editor.textContent).toBe('read');
    });

    test('click on label focuses the field', async () => {
        const onSubmit = jest.fn();
        const renderEditor = (isEditing: boolean) => {
            return <div data-testid="editor">{isEditing ? 'edit' : 'read'}</div>;
        };
        const { getByTestId, getByText, container } = render(
            <Field label="field" onSubmit={onSubmit} renderEditor={renderEditor} />,
        );

        const editor = getByTestId('editor');
        const label = getByText('field') as HTMLLabelElement;
        const focuser = container.querySelector('input[name=field]') as HTMLInputElement;

        expect(label).toBeInstanceOf(HTMLLabelElement);
        expect(focuser).toBeInstanceOf(HTMLInputElement);
        expect(editor.textContent).toBe('read');
        expect(document.activeElement).not.toBe(focuser);

        fireEvent.click(label);

        expect(editor.textContent).toBe('read');
        // test if the focuser of the field has focus.
        expect(document.activeElement).toBe(focuser);
    });
});

describe('Click outside', () => {
    afterEach(cleanup);

    test('click outside editor submits when enabled', () => {
        const onSubmit = jest.fn((stopEditing: () => void) => stopEditing());
        const renderEditor = (isEditing: boolean) => {
            return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
        };

        const { getByTestId } = render(
            <div data-testid="outside">
                <Field label="field" onSubmit={onSubmit} renderEditor={renderEditor} submitOnClickOutside={true} />
            </div>,
        );

        const inside = getByTestId('inside');

        // switch to edit mode
        expect(inside.textContent).toBe('read');
        fireEvent.click(inside);
        expect(inside.textContent).toBe('edit');

        // test if clicking inside the field keeps being in edit mode
        fireEvent.click(inside);
        expect(inside.textContent).toBe('edit');

        const outside = getByTestId('outside');
        fireEvent.click(outside);

        expect(inside.textContent).toBe('read');
    });

    test('click outside editor does not submit if not enabled', () => {
        const onSubmit = jest.fn((stopEditing: () => void) => stopEditing());
        const renderEditor = (isEditing: boolean) => {
            return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
        };

        const { getByTestId } = render(
            <div data-testid="outside">
                <Field label="field" onSubmit={onSubmit} renderEditor={renderEditor} />
            </div>,
        );

        const inside = getByTestId('inside');

        // switch to edit mode
        expect(inside.textContent).toBe('read');
        fireEvent.click(inside);
        expect(inside.textContent).toBe('edit');

        const outside = getByTestId('outside');
        fireEvent.click(outside);

        expect(inside.textContent).toBe('edit');
    });
});
