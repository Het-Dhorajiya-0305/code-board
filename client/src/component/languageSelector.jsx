import React, { useContext, useState } from 'react'
import { storeContext } from '../context/storeContext'

function LanguageSelector({ language, onselect }) {

    const {LANGUAGE_VERSIONS}=useContext(storeContext)
    const [showmenu, setShowmenu] = useState(false);

    return (
        <div className='flex items-center gap-3 px-4 py-2 '>
            <div className="capitalize text-[17px] font-poppins text-gray-400">language :</div>
            <div className="relative">
                <div className="bg-neutral-700 px-6 py-2 rounded-lg font-poppins min-w-28 text-center hover:cursor-pointer hover:bg-neutral-800" onClick={() => setShowmenu(!showmenu)}>{language}</div>
                <div className={`absolute z-10 bg-slate-950 w-45 rounded-lg py-1 flex flex-col gap-1 top-13 ${!showmenu ? 'hidden' : ''}`}>
                    {Object.entries(LANGUAGE_VERSIONS).map(([lang, version]) => (
                        <div key={lang} className={`hover:bg-slate-900 hover:text-cyan-500 hover:text-shadow-cyan-500 hover:text-shadow-xs px-4 py-1 hover:cursor-pointer ${lang==language?'bg-slate-900 text-cyan-500 text-shadow-cyan-500 text-shadow-xs':'text-gray-400'}`} onClick={() => { onselect(lang);setShowmenu(!showmenu) }}>
                            {lang} <span className='text-gray-600'>{version}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default LanguageSelector;
