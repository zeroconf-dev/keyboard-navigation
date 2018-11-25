import * as React from 'react';
import { fireEvent, render } from 'react-testing-library';
import { Field, Props } from '../../Field';

export const onSubmitStopEditing = () => jest.fn((stopEditing: () => void) => stopEditing());

export const renderFieldEditMode = (props: Props) => {
    const result = render(
        <div data-testid="outside">
            <Field {...props} />
        </div>,
    );

    const container = result.container.querySelector('.field') as HTMLElement;
    expect(container).toBeDefined();

    fireEvent.click(container);

    return result;
};
