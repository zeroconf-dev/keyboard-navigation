import { storiesOf } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { TabBoundary, NavigationMap, NavigationFieldMap } from '@zeroconf/keyboard-navigation';
import { css } from '@zeroconf/keyboard-navigation/stories/utils/css';
// import { useFocusable } from '@zeroconf/keyboard-navigation/hooks/useFocusable';
import { useFocus } from '@zeroconf/keyboard-navigation/stories/utils/useFocus';
import { globalStyles } from '@zeroconf/keyboard-navigation/stories/utils/globalStyles';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/stories/utils/HotkeyLegend';
import { Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/components';
import { Input } from '@zeroconf/keyboard-navigation/hooks/components/Tabbable';
import styled from '@emotion/styled';

const Container = css`
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(auto-fill, minmax(3rem, 1fr));
    grid-column-gap: 1rem;
    grid-row-gap: 2rem;
`(TabBoundary);

const EditorInput = css`
    border: none;
    font-family: sans-serif;
    font-size: 14px;
    height: 100%;
    outline: none;
    padding: 15px;
    width: 100%;
`(Input);

const EditorValue = styled.div`
    font-family: sans-serif;
    font-size: 14px;
    height: 100%;
    padding: 15px;
`;

interface EditorProps {
    className?: string;
    disabled?: boolean;
    focusKey: string;
}
const Editor = css`
    &:focus,
    &:focus-within,
    &.active {
        border-color: red;
        outline: none;
    }
    &.disabled {
        opacity: 0.4;
    }
    border: 1px solid black;
    border-radius: 5px;
    overflow: hidden;
    height: 3rem;
    ${(props: { disabled?: boolean }) =>
        props.disabled
            ? null
            : {
                  cursor: 'text',
              }};
`((props: EditorProps) => {
    const { className, disabled = false, focusKey } = props;
    const { focus, ref } = useFocus<HTMLDivElement>();
    const [value, setValue] = useState('');
    const [submittedValue, setSubmittedValue] = useState('');

    const [isEditorActive, setIsEditorActive] = useState(false);

    const activateEditor = useCallback(() => {
        if (disabled) {
            return false;
        }
        setIsEditorActive(true);
        setValue(submittedValue);
        return true;
    }, [focusKey, disabled, submittedValue]);

    const submitEditor = useCallback(() => {
        if (isEditorActive && !disabled) {
            setIsEditorActive(false);
            setSubmittedValue(value);
            focus();
        }
        return true;
    }, [disabled, isEditorActive, focus, value]);

    const clearEditor = useCallback(() => {
        if (isEditorActive || disabled) {
            return false;
        }
        setSubmittedValue('');
        focus();
        return true;
    }, [disabled, isEditorActive]);

    const cancelEditor = useCallback(
        (e: any) => {
            if (isEditorActive && !disabled) {
                setIsEditorActive(false);
                if (e.type !== 'blur') {
                    focus();
                }
            }
            return true;
        },
        [disabled, isEditorActive, focus],
    );

    const children = isEditorActive
        ? [
              <Hotkey key="submit" hotkey="enter" handler={submitEditor} />,
              <Hotkey key="cancel" hotkey="esc" handler={cancelEditor} />,
              <EditorInput
                  autoFocus={true}
                  key="editor"
                  name="editor"
                  onBlur={cancelEditor}
                  onChange={e => setValue(e.target.value)}
                  placeholder={focusKey}
                  value={value}
              />,
          ]
        : [
              <Hotkey key="activate" hotkey="enter" handler={activateEditor} />,
              <Hotkey key="clear" hotkey="del" handler={clearEditor} />,
              <EditorValue className={disabled ? 'disabled' : undefined} key="value">
                  {submittedValue || focusKey}
              </EditorValue>,
          ];

    // To "inherit" arrow key navigation.
    const crossLocalBoundary = true;

    return (
        <TabBoundary
            className={`${className} ${disabled ? 'disabled' : ''}`}
            crossLocalBoundary={crossLocalBoundary}
            boundaryKey={focusKey}
            onClick={activateEditor}
            ref={ref}
            tabIndex={-1}
        >
            {children}
        </TabBoundary>
    );
});

// prettier-ignore
const navigationMap: NavigationFieldMap = [
        ['editor1', 'editor2', 'editor3'],
        ['editor4', 'editor5', 'editor6'],
        ['editor7', 'editor8', 'editor9'],
    ];
storiesOf('App/Editor', module)
    // prettier-ignore
    .add('Grid', () => (
        <>
            {globalStyles}
            <Container scope="grid">
                <Editor focusKey="editor1" />
                <Editor focusKey="editor2" />
                <Editor focusKey="editor3" />

                <Editor focusKey="editor4" />
                <Editor disabled={true} focusKey="editor5" />
                <Editor focusKey="editor6" />

                <Editor focusKey="editor7" />
                <Editor focusKey="editor8" />
                <Editor focusKey="editor9" />
                <NavigationMap navigationMap={navigationMap} />
            </Container>
            <div style={{ height: '1rem' }}>
                <HotkeyLegend />
            </div>
        </>
    ));
