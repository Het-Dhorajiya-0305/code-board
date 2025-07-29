import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import FileExplorer from '../components/FileExplorer.jsx';

const socket = io('http://localhost:3001'); // Connect to backend

function EditorPage({ initialCode = '// Write your code here', language = 'javascript' }) {
  const editorRef = useRef(null);

  // Handle editor mount
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    console.log('Editor mounted:', editor);
  }

  // Handle code changes
  function handleEditorChange(value, event) {
    socket.emit('code-change', value); // Send code to backend
  }

  // Listen for code updates from other users
  useEffect(() => {
    socket.on('code-update', (code) => {
      if (editorRef.current && editorRef.current.getValue() !== code) {
        editorRef.current.setValue(code); // Update editor content
      }
    });

    return () => {
      socket.off('code-update'); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center ">
      <FileExplorer></FileExplorer>
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={initialCode}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}

export default EditorPage;