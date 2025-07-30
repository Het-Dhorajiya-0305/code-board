import React, { useRef, useEffect, useContext, useState } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import logo from '../assets/logo.png'
import Avatar from 'react-avatar';
import { storeContext } from '../context/storeContext';



function EditorPage() {
  const editorRef = useRef(null);
  const { roomCode, username, setRoomCode, setUsername, navigate } = useContext(storeContext);

  const [langauge,setlangauge]=useState('javascript');


  const handleCopyRoomId = () => {

  }

  const leaveRoom = () => {
    navigate('/');
  }


  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="w-1/6 bg-neutral-800 h-full px-4 py-2 flex flex-col max-xl:w-1/5 max-lg:w-1/4">
        <div className="flex items-center justify-start gap-2 w-full h-lg p-4 border-b-2 border-neutral-700">
          <img src={logo} alt="" className='rounded-full w-13 max-lg:w-11' />
          <div className="capitalize font-poppins flex flex-col gap-1">
            <h1 className='text-xl font-bold max-lg:text-[15px]'>codeboard</h1>
            <h2 className='text-green-700 font-bold text-[9px]'>realtime code collaboration</h2>
          </div>
        </div>
        <div className="w-full h-6/7 flex flex-col gap-4 justify-between">
          <div className="flex gap-4 items-center flex-wrap p-4">
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
            <div className="flex flex-col items-center capitalize gap-1"><Avatar name="het dhorajiya" size="50" className='rounded-full' />het d</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button className='border-none bg-white px-4 py-2  text-black rounded-2xl capitalize font-poppins font-bold hover:cursor-pointer hover:bg-gray-500 transition-all duration-300 max-lg:text-sm' onClick={handleCopyRoomId}>copy room code</button>
            <button className='border-none bg-green-500 px-4 py-2 text-black rounded-2xl font-poppins capitalize font-bold hover:bg-green-600 hover:cursor-pointer transition-all duration-300 max-lg:text-sm' onClick={leaveRoom}>leave room</button>
          </div>
        </div>
      </div>
      <div className="w-5/6 h-full max-xl:w-4/5 max-lg:w-3/4">
        <div className="bg-neutral-800 py-1">
          <select name="" id="" className='px-2 py-1 text-white bg-neutral-800 w-30' onChange={(e)=>setlangauge(e.target.value)}>
            <option value="javascript" selected>js</option>
            <option value="C++">c++</option>
            <option value="java">java</option>
            <option value="python">python</option>
          </select>
        </div>
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage={langauge}
          defaultValue='"Code Here!"'
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

export default EditorPage;