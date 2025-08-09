import React, { useContext, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from './languageSelector';
import { storeContext } from '../context/storeContext';
import Output from './Output';


function CodeEditor({ socketRef, roomId, username }) {
  const { isRemoteUpdate,CODE_SNIPPETS,language,value,setValue,setlanguage } = useContext(storeContext);
  const editorRef = useRef();



  const onselect = (lang) => {
    setlanguage(lang);
    setValue(CODE_SNIPPETS[lang]);
    socketRef.current?.emit('language-change', { roomId, language: lang, snippet: CODE_SNIPPETS[lang] });
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  // Handle user typing
  const handleTyping = () => {
    socketRef.current?.emit('typing', { roomId, username });
  };

  // Send code change
  const handleCodeChange = (newCode) => {
    if (!isRemoteUpdate.current) {
      socketRef.current?.emit('code-change', { roomId, code: newCode });
    }
    setValue(newCode);
  };

  // Listen for code updates from other users
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const onCodeChanged = ({ code }) => {
      isRemoteUpdate.current = true;
      setValue(code);
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 0);
    };

    const onLanguageChanged = ({ language }) => {
      setlanguage(language);
      setValue(CODE_SNIPPETS[language]);
    };

    socket.on('code-changed', onCodeChanged);
    socket.on('language-changed', onLanguageChanged);

    return () => {
      socket.off('code-changed', onCodeChanged);
      socket.off('language-changed', onLanguageChanged);
    };
  }, [socketRef.current]);


  return (
    <div className="flex gap-1 w-full">
      <div className="w-3/5">
        <LanguageSelector language={language} onselect={onselect} />
        <Editor
          height="92vh"
          theme="vs-dark"
          language={language}
          value={value}
          onChange={(val) => {
            handleTyping();
            handleCodeChange(val);
          }}
          onMount={onMount}
        />
      </div>
      <div className="w-2/5 p-3">
        <Output editorRef={editorRef} language={language} />
      </div>
    </div>
  );
}

export default CodeEditor;
