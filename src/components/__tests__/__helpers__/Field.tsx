import * as React from 'react';
import { fireEvent, render } from 'react-testing-library';
import { Field, Props } from '../../../hooks/components/Field';
import { expectInstanceOf } from './assert';

export const onSubmitStopEditing = () => jest.fn((stopEditing: () => void) => stopEditing());

export const renderFieldEditMode = (props: Props) => {
    const result = render(
        <div data-testid="outside">
            <Field {...props} />
        </div>,
    );

    const container = expectInstanceOf(result.container.querySelector('.field'), HTMLDivElement);

    fireEvent.click(container);

    return result;
};
