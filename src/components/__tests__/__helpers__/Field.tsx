/* istanbul ignore file */
import { fireEvent, render } from '@testing-library/react';
import { expectInstanceOf } from '@zeroconf/keyboard-navigation/components/__tests__/__helpers__/assert';
import { Props } from '@zeroconf/keyboard-navigation/hooks/components/Field';
import * as React from 'react';

export const onSubmitStopEditing = () => jest.fn((stopEditing: () => void) => stopEditing());

export const renderFieldEditMode = <P extends Props, C extends React.ComponentType<P>>(Field: C, props: P) => {
    const field = React.createElement(Field, props, props);
    const result = render(<div data-testid="outside">{field}</div>);

    const container = expectInstanceOf(result.container.querySelector('.field'), HTMLDivElement);

    fireEvent.click(container);

    return result;
};

export const rerenderFieldEditMode = <P extends Props, C extends React.ComponentType<P>>(
    Field: C,
    props: P,
    rerender: (ue: React.ReactElement<any>) => void,
) => {
    const field = React.createElement(Field, props, props);
    rerender(<div data-testid="outside">{field}</div>);
};
