import { cleanup, fireEvent, render } from '@testing-library/react';
import { Field as FieldClassic, Props } from '@zeroconf/keyboard-navigation/components/Field';
import { Focuser } from '@zeroconf/keyboard-navigation/components/Focuser';
import { TabBoundary } from '@zeroconf/keyboard-navigation/components/TabBoundary';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/helpers/assert';
import {
    onSubmitStopEditing,
    renderFieldEditMode,
    rerenderFieldEditMode,
} from '@zeroconf/keyboard-navigation/components/__tests__/helpers/Field';
import { Field as FieldHooks } from '@zeroconf/keyboard-navigation/hooks/components/Field';
import * as React from 'react';

[
    {
        Field: FieldClassic,
    },
    {
        Field: FieldHooks,
    },
].forEach(components => {
    const Field = components.Field as typeof FieldClassic;

    const suiteName = Field === FieldClassic ? 'Classic' : 'Hooks';

    describe(`Field.${suiteName}`, () => {
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

            test('onEditStart is called when entering edit mode', async () => {
                const onSubmit = onSubmitStopEditing();
                const onEditStart = jest.fn();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { container } = render(
                    <Field label="field" onEditStart={onEditStart} onSubmit={onSubmit} renderEditor={renderEditor} />,
                );

                const field = expectInstanceOf(container.querySelector('.field'), HTMLDivElement);
                fireEvent.click(field);

                expect(onEditStart).toHaveBeenCalled();
            });

            test('onEditStop is called when exiting edit mode', async () => {
                const onSubmit = onSubmitStopEditing();
                const onEditStop = jest.fn();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };

                const { container } = renderFieldEditMode(Field, {
                    label: 'field',
                    onEditStop,
                    onSubmit,
                    renderEditor,
                } as Props);

                const focuser = expectInstanceOf(container.querySelector('[name=field]'), HTMLInputElement);
                fireEvent.keyDown(focuser, { key: 'Escape' });

                expect(onEditStop).toHaveBeenCalled();
            });

            test('activating edit mode with space key', () => {
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { container, getByText } = render(
                    <Field label="field" onSubmit={onSubmit} renderEditor={renderEditor} />,
                );

                const focuser = expectInstanceOf(container.querySelector('[name=field]'), HTMLInputElement);
                fireEvent.keyDown(focuser, { key: ' ' });

                getByText('edit');
            });
        });

        describe('Read mode', () => {
            afterEach(cleanup);

            test('call stop editing does not throw', () => {
                const onSubmit = onSubmitStopEditing();
                let doStopEditing: () => void;
                const renderEditor = (isEditing: boolean, stopEditing: () => void) => {
                    doStopEditing = stopEditing;
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                render(<Field label="field" onSubmit={onSubmit} renderEditor={renderEditor} />);
                expect(() => doStopEditing()).not.toThrow();
            });

            test('rendering error messages', () => {
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { getByText } = render(
                    <Field
                        errorMessage="Validation error"
                        label="field"
                        onSubmit={onSubmit}
                        renderEditor={renderEditor}
                    />,
                );

                getByText('Validation error');
            });
        });

        describe('Edit mode', () => {
            afterEach(cleanup);
            test('escape on field exits edit mode', () => {
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };

                const { container, getByText } = renderFieldEditMode(Field, {
                    label: 'field',
                    onSubmit,
                    renderEditor,
                } as Props);

                const field = expectInstanceOf(container.querySelector('.field'), HTMLDivElement);
                getByText('edit');

                fireEvent.keyDown(field, { key: 'Escape', shiftKey: true });
                getByText('edit');

                fireEvent.keyDown(field, { key: 'Escape' });
                getByText('read');
            });
            test('escape on focuser exits edit mode', () => {
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };

                const { container, getByText } = renderFieldEditMode(Field, {
                    label: 'field',
                    onSubmit,
                    renderEditor,
                } as Props);

                const focuser = expectInstanceOf(container.querySelector('[name=field]'), HTMLInputElement);

                getByText('edit');
                fireEvent.keyDown(focuser, { key: 'Escape' });
                getByText('read');
            });

            test('enter key submits the field', () => {
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };

                const { container } = renderFieldEditMode(Field, {
                    label: 'field',
                    onSubmit,
                    renderEditor,
                } as Props);

                const field = expectInstanceOf(container.querySelector('.field'), HTMLDivElement);

                fireEvent.keyDown(field, { key: 'Enter', shiftKey: true });
                expect(onSubmit).not.toHaveBeenCalled();

                fireEvent.keyDown(field, { key: 'Enter' });
                expect(onSubmit).toHaveBeenCalledWith(expect.anything(), 'enter-key');
            });
        });

        describe('Click outside', () => {
            afterEach(cleanup);

            test(`click on field doesn't propagate out`, () => {
                const onClick = jest.fn();
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { container } = render(
                    <div onClick={onClick}>
                        <Field
                            className="field-container"
                            label="field"
                            onSubmit={onSubmit}
                            renderEditor={renderEditor}
                        />
                    </div>,
                );

                const fieldContainer = expectInstanceOf(container.querySelector('.field-container'), HTMLDivElement);
                fireEvent.click(fieldContainer);

                expect(onClick).not.toHaveBeenCalled();
            });

            test('click outside editor submits when enabled', () => {
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };

                const { getByTestId } = renderFieldEditMode(Field, {
                    label: 'field',
                    onSubmit,
                    renderEditor,
                    submitOnClickOutside: true,
                } as Props);

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

                const { getByTestId } = renderFieldEditMode(Field, {
                    label: 'field',
                    onSubmit,
                    renderEditor,
                } as Props);
                const outside = getByTestId('outside');

                fireEvent.click(outside);
                expect(onSubmit).not.toHaveBeenCalled();
            });
        });

        describe('Navigation hooks', () => {
            afterEach(cleanup);
            test('not focusable when disabled', () => {
                const onSubmit = onSubmitStopEditing();
                const onSpace = jest.fn();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { container } = render(
                    <Field
                        disabled={true}
                        label="field"
                        onSpace={onSpace}
                        onSubmit={onSubmit}
                        renderEditor={renderEditor}
                    />,
                );

                const label = expectInstanceOf(container.querySelector('label'), HTMLLabelElement);
                fireEvent.click(label);

                expect(container.querySelector(':focus')).toBeNull();
            });

            test('onSpace callback', () => {
                const onSubmit = onSubmitStopEditing();
                const onSpace = jest.fn();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { container } = render(
                    <Field label="field" onSpace={onSpace} onSubmit={onSubmit} renderEditor={renderEditor} />,
                );

                const focuser = expectInstanceOf(container.querySelector('[name=field]'), HTMLInputElement);
                fireEvent.keyDown(focuser, { key: ' ' });

                expect(onSpace).toHaveBeenCalled();
            });

            test('escape focuses parent', () => {
                const onSubmit = onSubmitStopEditing();
                const onFocus = jest.fn();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { container } = render(
                    <TabBoundary>
                        <Focuser focusKey="focuser" onFocus={onFocus} />
                        <TabBoundary boundaryKey="field-container">
                            <Field label="field" onSubmit={onSubmit} renderEditor={renderEditor} />,
                        </TabBoundary>
                    </TabBoundary>,
                );

                const focuser = expectInstanceOf(container.querySelector('[name=focuser]'), HTMLInputElement);
                const fieldFocuser = expectInstanceOf(container.querySelector('[name=field]'), HTMLInputElement);

                fireEvent.keyDown(fieldFocuser, { key: 'Escape' });

                expect(container.querySelector(':focus')).toBe(focuser);
            });

            test('onEscape on Field is called', () => {
                const onSubmit = onSubmitStopEditing();
                const onEscape = jest.fn();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { container } = render(
                    <Field label="field" onEscape={onEscape} onSubmit={onSubmit} renderEditor={renderEditor} />,
                );

                const focuser = expectInstanceOf(container.querySelector('[name=field]'), HTMLInputElement);
                fireEvent.keyDown(focuser, { key: 'Escape' });

                expect(onEscape).toHaveBeenCalled();
            });

            test('onEnter on Field is called', () => {
                const onSubmit = onSubmitStopEditing();
                const onEnter = jest.fn();
                const renderEditor = (isEditing: boolean) => {
                    return <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>;
                };
                const { container } = render(
                    <Field label="field" onEnter={onEnter} onSubmit={onSubmit} renderEditor={renderEditor} />,
                );

                const focuser = expectInstanceOf(container.querySelector('[name=field]'), HTMLInputElement);
                fireEvent.keyDown(focuser, { key: 'Enter' });

                expect(onEnter).toHaveBeenCalled();
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

                const { container, getByTestId } = renderFieldEditMode(Field, {
                    label: 'field',
                    onSubmit,
                    renderEditor,
                    submitOnBlur: true,
                } as Props);

                const outside = getByTestId('outside');
                const editor = expectInstanceOf(container.querySelector('input[data-testid=editor]'), HTMLInputElement);

                fireEvent.blur(outside);
                expect(onSubmit).not.toHaveBeenCalled();

                fireEvent.blur(editor);
                expect(onSubmit).toHaveBeenCalledWith(expect.anything(), 'blur');
            });

            test(`Submit is *not* called when bluring if submitOnBlur isn't enabled`, () => {
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => {
                    return (
                        <div data-testid="inside">
                            {isEditing ? <input autoFocus={true} data-testid="editor" defaultValue="edit" /> : 'read'}
                        </div>
                    );
                };

                const { getByTestId } = renderFieldEditMode(Field, {
                    label: 'field',
                    onSubmit,
                    renderEditor,
                } as Props);

                const editor = getByTestId('editor');

                fireEvent.blur(editor);
                expect(onSubmit).not.toHaveBeenCalled();
            });
        });

        describe('Disable', () => {
            afterEach(cleanup);
            test('disabling field in edit mode, exits it', () => {
                const onSubmit = onSubmitStopEditing();
                const renderEditor = (isEditing: boolean) => (
                    <div data-testid="inside">{isEditing ? 'edit' : 'read'}</div>
                );

                const { getByText, rerender } = renderFieldEditMode(Field, {
                    disabled: false,
                    label: 'field',
                    onSubmit,
                    renderEditor,
                } as Props);

                getByText('edit');
                rerenderFieldEditMode(
                    Field,
                    {
                        disabled: true,
                        label: 'field',
                        onSubmit,
                        renderEditor,
                    } as Props,
                    rerender,
                );

                getByText('read');
            });
        });

        describe('Basic component properties', () => {
            afterEach(cleanup);
            test('remount should not throw', () => {
                const onSubmit = jest.fn();
                const renderEditor = () => <div />;
                const { rerender } = render(
                    <Field key="field" label="field" onSubmit={onSubmit} renderEditor={renderEditor} />,
                );

                expect(() => {
                    rerender(
                        <Field key="field-remount" label="field" onSubmit={onSubmit} renderEditor={renderEditor} />,
                    );
                }).not.toThrowError();
            });
        });
    });
});
