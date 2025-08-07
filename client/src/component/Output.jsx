import React, { useContext, useState } from 'react'
import axios from 'axios'
import { storeContext } from '../context/storeContext';
import { toast } from 'react-toastify'
import LoadingButtonsTransition from '../component/Loader.jsx'
import Loader from '../component/Loader.jsx';

function Output({ editorRef, language }) {

    const { LANGUAGE_VERSIONS } = useContext(storeContext);

    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            setLoading(true);
            const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
                "language": language,
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
            response.data.run.stderr ? setIsError(true) : setIsError(false);
            setOutput(response.data.run.output.split("\n"));
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
            <button className='relative border-[1px] h-[41px] capitalize p-2 max-w-30 rounded-lg text-gray-400 hover:bg-gray-400 hover:text-black hover:cursor-pointer font-bold transition-all duration-200 ' onClick={runCode} >{loading ? <Loader></Loader> : 'run code'}</button>
            <div className={`output-box border-[1px] overflow-y-scroll scroll-smooth scroll-1  rounded-lg h-155 p-3  ${isError ? 'text-red-700 border-red-700' : 'text-gray-400 border-gray-400'}`}>{output ? output.map((line,index)=>(
                <div className="" key={index}>{line}</div>
            )) : 'Click "Run Code" to see the output here'}</div>
        </div>
    )
}

export default Output