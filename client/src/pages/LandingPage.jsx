import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import axios from 'axios';
import { storeContext } from '../context/storeContext';
import logo from '../assets/logo.png'

function LandingPage() {

  const { navigate } = useContext(storeContext);


  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [projectName, setProjectName] = useState('');


  const handleNewRoom = () => {
    setRoomCode("fswfwfnewfewj32r2rnu2o");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRoom) {
      // Logic to create a new room with projectName and username
      if (!projectName || !username) {
        toast.error("Please fill in all fields");
        return;
      }
      try {

        const response = axios.post(backendUrl + '/create-room', { projectName, username }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.data.success) {
          toast.success("Room created successfully");
          navigate(`/room/${response.data.roomCode}`)
        }

      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Error creating room:", error);
      }
    } else {
      if (!roomCode || !username) {
        toast.error("Please fill in all fields");
        return;
      }
      try {
        const response = axios.post(backendUrl + '/join-room', { roomCode, username }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.data.success) {
          toast.success("Joined room successfully");
          navigate(`/room/${response.data.roomCode}`);
        }
      }
      catch (error) {
        toast.error(error.response.data.message);
        console.error("Error joining room:", error);
      }
    }
    // Reset form fields after submission
    setRoomCode('');
    setUsername('');
    setProjectName('');
  }
  return (
    <div className=' text-white w-full h-full flex items-center justify-center'>
      <form onSubmit={(e) => { handleSubmit(e) }} className='flex flex-col items-center w-lg h-max bg-slate-900 gap-px rounded-2xl p-6'>
        <div className="flex items-center justify-start gap-4 w-full px-4">
          <img src={logo} alt="" className='rounded-full w-24' />
          <div className="capitalize font-poppins flex flex-col gap-1">
            <h1 className='text-3xl font-bold'>codeboard</h1>
            <h2 className='text-green-700 font-bold'>realtime code collabration</h2>
          </div>
        </div>
        <h1 className='p-4 text-4xl capitalize font-poppins'>join room</h1>
        <div className="p-3 w-full">
          <input
            required
            type='text'
            placeholder='Enter room code'
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className='p-4 rounded-2xl w-full bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins placeholder:capitalize'
          ></input>
        </div>
        <div className="p-3 w-full">
          <input
            required
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='username'
            className='p-4 rounded-2xl w-full bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins placeholder:capitalize'
          ></input>
        </div>
        <div className="p-3 flex items-center">
          <button type='submit' className='border-none bg-green-600 px-8 py-2 text-xl font-poppins capitalize rounded-2xl hover:bg-green-700 hover:cursor-pointer'>join</button>
        </div>
        <p className='font-poppins text-center'>if you don't have an invite then create <span className='text-green-500 hover:cursor-pointer hover:text-green-600 border-b-1' onClick={handleNewRoom}>new room</span></p>
      </form>

    </div>
  )
}

export default LandingPage