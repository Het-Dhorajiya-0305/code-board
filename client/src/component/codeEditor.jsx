import React, { useContext, useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import LanguageSelector from './languageSelector';
import { storeContext } from '../context/storeContext';
import Output from './Output';


function CodeEditor() {

    const { CODE_SNIPPETS } = useContext(storeContext)

    const editorRef = useRef();

    const [language, setlanguage] = useState('javascript');
    const [value, setValue] = useState(CODE_SNIPPETS['javascript'])

    const onselect = (lang) => {
        setlanguage(lang);
        setValue(CODE_SNIPPETS[lang]);
    }


    const onMount = (editor) => {

        editorRef.current = editor;
        editor.focus();
    }
    return (
        <div className="flex gap-1 w-full">
            <div className="w-3/5">
                <LanguageSelector language={language} onselect={onselect}></LanguageSelector>
                <Editor
                    height="92vh"
                    theme="vs-dark"
                    language={language}
                    defaultLanguage={CODE_SNIPPETS[language]}
                    value={value}
                    onChange={(value) => setValue(value)}
                    onMount={onMount}
                />
            </div>
            <div className="w-2/5 p-3">
                <Output editorRef={editorRef} language={language}></Output>
            </div>
        </div>
    )
}

export default CodeEditor