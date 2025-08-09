import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css'
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';

export const backendUrl=import.meta.env.VITE_BACKEND_URL;

function App() {



  return (
    <div className='bg-slate-950 h-screen w-full text-white flex iteam-center justify-center'>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<LandingPage></LandingPage>}></Route>
        <Route path='/editor/:roomId' element={<EditorPage></EditorPage>}></Route>

      </Routes>
    </div>
  )
}

export default App
