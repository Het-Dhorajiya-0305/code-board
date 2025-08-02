import React, { useContext, useState } from 'react'
import axios from 'axios'
import { storeContext } from '../context/storeContext';
import { toast } from 'react-toastify'
import  LoadingButtonsTransition  from '../component/Loader.jsx'

function Output({ editorRef, language }) {

    const { LANGUAGE_VERSIONS } = useContext(storeContext);

    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            setLoading(true);
            const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
                // "language": language,
                "version": LANGUAGE_VERSIONS[language],
                "files": [
                    {
                        "content": sourceCode
                    }
                ]
            }, {
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            setOutput(response.data.run.output);
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || "Unable to run code", {
                autoClose: 2000
            })
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className='w-full flex flex-col gap-2'>
            <button className='relative border-[1px] capitalize p-2 max-w-30 rounded-lg text-gray-400 hover:bg-gray-400 hover:text-black hover:cursor-pointer font-bold transition-all duration-200 ' onClick={runCode} isLoading={loading}>run code{loading ? <LoadingButtonsTransition loading={loading}></LoadingButtonsTransition> : ''}</button>
            <div className="border-[1px] border-gray-400 rounded-lg h-155 p-3 text-gray-400">{output ? output : 'Click "Run Code" to see the output here'}</div>
        </div>
    )
}

export default Output