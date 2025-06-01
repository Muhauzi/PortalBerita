import React, { useRef, useEffect } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const WysiwygEditor: React.FC<Props> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const format = (command: string, value?: string) => {
        if (!editorRef.current) return;

        editorRef.current.focus();

        // Basic formatting using modern APIs for bold, italic, underline
        if (command === 'bold' || command === 'italic' || command === 'underline') {
            document.execCommand(command, false, value);
        } else if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
            document.execCommand(command, false, value);
        } else if (command === 'formatBlock') {
            document.execCommand('formatBlock', false, value);
        } else if (command === 'removeFormat') {
            document.execCommand('removeFormat', false, value);
        }
        handleInput();
    };

    return (
        <div className="border rounded-md p-3">
            <div className="mb-2 space-x-2">
                <button type="button" onClick={() => format('bold')}><b>B</b></button>
                <button type="button" onClick={() => format('italic')}><i>I</i></button>
                <button type="button" onClick={() => format('underline')}><u>U</u></button>
                <button type="button" onClick={() => format('insertUnorderedList')}>• List</button>
                <button type="button" onClick={() => format('insertOrderedList')}>1. List</button>
                <button type="button" onClick={() => format('formatBlock', '<blockquote>')}>❝ Quote</button>
                <button type="button" onClick={() => format('removeFormat')}>Clear</button>
            </div>
            <div
                ref={editorRef}
                className="min-h-[150px] border p-2 rounded bg-white"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                style={{ outline: 'none' }}
            />
        </div>
    );
};

export default WysiwygEditor;
