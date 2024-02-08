import { useCallback, useState } from 'react';
import { TabBoundary, NavigationMap, NavigationFieldMap } from '@zeroconf/keyboard-navigation';
import { useFocus } from '@zeroconf/keyboard-navigation/stories/utils/useFocus';
import { HotkeyLegend } from '@zeroconf/keyboard-navigation/stories/utils/HotkeyLegend';
import { Hotkey } from '@zeroconf/keyboard-navigation/hotkeys/components';
import { Input } from '@zeroconf/keyboard-navigation/hooks/components/Tabbable';

const meta = {
    title: 'App/Editor',
};

export default meta;

interface EditorProps {
    className?: string;
    disabled?: boolean;
    focusKey: string;
}

const Editor = (props: EditorProps) => {
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
              <Input
                  autoFocus={true}
                  className="size-full border-none p-4 text-sm outline-none"
                  key="editor"
                  name="editor"
                  onBlur={cancelEditor}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={focusKey}
                  value={value}
              />,
          ]
        : [
              <Hotkey key="activate" hotkey="enter" handler={activateEditor} />,
              <Hotkey key="clear" hotkey="del" handler={clearEditor} />,
              <div className="h-full p-4 text-sm" key="value">
                  {submittedValue || focusKey}
              </div>,
          ];

    // To "inherit" arrow key navigation.
    const crossLocalBoundary = true;

    const classNames = `${className ?? ''} focus:outline-none overflow-hidden h-12 border border-solid rounded-md border-black focus:border-red-500 focus-within:border-red-500`;
    return (
        <TabBoundary
            className={classNames}
            crossLocalBoundary={crossLocalBoundary}
            boundaryKey={focusKey}
            onClick={activateEditor}
            ref={ref}
            tabIndex={-1}
        >
            {children}
        </TabBoundary>
    );
};

// prettier-ignore
const navigationMap: NavigationFieldMap = [
        ['editor1', 'editor2', 'editor3'],
        ['editor4', 'editor5', 'editor6'],
        ['editor7', 'editor8', 'editor9'],
    ];

export const Grid = () => (
    <>
        <TabBoundary className="grid grid-cols-3 gap-x-4 gap-y-8" scope="grid">
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
        </TabBoundary>
        <div style={{ height: '1rem' }}>
            <HotkeyLegend />
        </div>
    </>
);

Grid.story = {
    title: 'Grid',
};
