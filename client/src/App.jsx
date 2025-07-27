import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css'
import LandingPage from './pages/LandingPage';

export const backendUrl=import.meta.env.BACKEND_URL;

function App() {



  return (
    <div className='bg-slate-950 h-screen w-full p-8 text-white flex iteam-center justify-center'>
      <ToastContainer />
      <LandingPage></LandingPage>
    </div>
  )
}

export default App
