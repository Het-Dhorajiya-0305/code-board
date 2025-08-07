import { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const storeContext = createContext(null);

const StoreContextProvider = (props) => {
    const LANGUAGE_VERSIONS = {
        javascript: "18.15.0",
        typescript: "5.0.3",
        python: "3.10.0",
        java: "15.0.2",
        csharp: "6.12.0",
        php: "8.2.3"
    };

    const ACTIONS = {
        JOIN: 'join',
        JOINED: 'joined',
        DISCONNECTED: 'disconnected',
        CODE_CHANGE: 'code-change',
        SYNC_CODE: 'sync-code',
        LEAVE: 'leave'
    };

    const CODE_SNIPPETS = {
        javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
        typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
        python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
        java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
        csharp: 'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
        php: "<?php\n\n$name = 'Alex';\necho $name;\n"
    };

    const navigate = useNavigate();

    const [roomCode, setRoomCodeState] = useState(() => localStorage.getItem('roomCode') || '');
    const [username, setUsernameState] = useState(() => localStorage.getItem('username') || '');
    const [email, setEmailState] = useState(() => localStorage.getItem('email') || '');

    const setRoomCode = (value) => {
        setRoomCodeState(value);
        localStorage.setItem('roomCode', value);
    };

    const setUsername = (value) => {
        setUsernameState(value);
        localStorage.setItem('username', value);
    };

    const setEmail = (value) => {
        setEmailState(value);
        localStorage.setItem('email', value);
    };

    const clearUserData = () => {
        setRoomCodeState('');
        setUsernameState('');
        setEmailState('');
        localStorage.removeItem('roomCode');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
    };

    const contextValue = {
        navigate,
        roomCode,
        setRoomCode,
        setUsername,
        username,
        LANGUAGE_VERSIONS,
        CODE_SNIPPETS,
        ACTIONS,
        setEmail,
        email,
        clearUserData
    };

    return (
        <storeContext.Provider value={contextValue}>
            {props.children}
        </storeContext.Provider>
    );
};

export default StoreContextProvider;


