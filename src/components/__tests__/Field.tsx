import * as React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { Field } from '../Field';
import { onSubmitStopEditing, renderFieldEditMode } from './__helpers__/Field';

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

        // test that the field has not switched to edit mode.
        expect(editor.textContent).toBe('read');
        // test if the focuser of the field has focus.
        expect(document.activeElement).toBe(focuser);
    });
});

describe('Click outside', () => {
    afterEach(cleanup);

    test('click outside editor submits when enabled', () => {
        const onSubmit = onSubmitStopEditing();
        const renderEditor = (isEditing: boolean) => {
            return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
        };

        const { getByTestId } = renderFieldEditMode({
            label: 'field',
            onSubmit,
            renderEditor,
            submitOnClickOutside: true,
        });

        const inside = getByTestId('inside');
        const outside = getByTestId('outside');

        // test if clicking inside the field keeps being in edit mode
        fireEvent.click(inside);
        expect(onSubmit).not.toHaveBeenCalled();

        fireEvent.click(outside);
        expect(onSubmit).toHaveBeenCalledWith(expect.anything(), 'click-outside');
    });

    test('click outside editor does not submit if not enabled', () => {
        const onSubmit = onSubmitStopEditing();
        const renderEditor = (isEditing: boolean) => {
            return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
        };

        const { getByTestId } = renderFieldEditMode({
            label: 'field',
            onSubmit,
            renderEditor,
        });
        const outside = getByTestId('outside');

        fireEvent.click(outside);
        expect(onSubmit).not.toHaveBeenCalled();
    });
});

describe('Blur handler', () => {
    afterEach(cleanup);

    test('Submit is called when bluring if submitOnBlur is enabled', () => {
        const onSubmit = onSubmitStopEditing();
        const renderEditor = (isEditing: boolean) => {
            return (
                <div data-testid="inside">
                    {isEditing ? <input autoFocus={true} data-testid="editor" defaultValue="edit" /> : 'read'}
                </div>
            );
        };

        const { getByTestId } = renderFieldEditMode({
            label: 'field',
            onSubmit,
            renderEditor,
            submitOnBlur: true,
        });

        const outside = getByTestId('outside');
        const editor = getByTestId('editor');

        fireEvent.blur(outside);
        expect(onSubmit).not.toHaveBeenCalled();

        fireEvent.blur(editor);
        expect(onSubmit).toHaveBeenCalledWith(expect.anything(), 'blur');
    });

    test("Submit is *not* called when bluring if submitOnBlur isn't enabled", () => {
        const onSubmit = onSubmitStopEditing();
        const renderEditor = (isEditing: boolean) => {
            return (
                <div data-testid="inside">
                    {isEditing ? <input autoFocus={true} data-testid="editor" defaultValue="edit" /> : 'read'}
                </div>
            );
        };

        const { getByTestId } = renderFieldEditMode({
            label: 'field',
            onSubmit,
            renderEditor,
        });

        const editor = getByTestId('editor');

        fireEvent.blur(editor);
        expect(onSubmit).not.toHaveBeenCalled();
    });
});
