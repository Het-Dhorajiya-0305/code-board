import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { storeContext } from '../context/storeContext';
import logo from '../assets/logo.png';
import { v4 as uuidv4 } from 'uuid';

function LandingPage() {
  const {
    email, setEmail,
    navigate, roomCode, setRoomCode,
    username, setUsername
  } = useContext(storeContext);

  const handleNewRoom = () => {
    const newRoomId = uuidv4();
    setRoomCode(newRoomId);
    toast.success("✅ New room created!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roomCode.trim() || !username.trim()) {
      toast.error("❌ Please fill in all fields.");
      return;
    }

    // Navigate directly to the editor (socket join is handled inside EditorPage)
    navigate(`/editor/${roomCode}`);
  };

  return (
    <div className='text-white w-full h-full flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center w-lg h-max bg-slate-900 gap-px rounded-2xl p-6'
      >
        <div className="flex items-center justify-start gap-4 w-full px-4">
          <img src={logo} alt="logo" className='rounded-full w-24' />
          <div className="capitalize font-poppins flex flex-col gap-1">
            <h1 className='text-3xl font-bold'>codeboard</h1>
            <h2 className='text-green-700 font-bold text-sm'>realtime code collaboration</h2>
          </div>
        </div>

        <h1 className='p-4 text-4xl capitalize font-poppins'>join room</h1>

        <div className="p-3 w-full">
          <input
            type='text'
            placeholder='Enter room code'
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className='p-4 rounded-2xl w-full bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins placeholder:capitalize'
            required
          />
        </div>

        <div className="p-3 w-full">
          <input
            type='text'
            placeholder='Enter username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='p-4 rounded-2xl w-full bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins placeholder:capitalize'
            required
          />
        </div>

        <div className="p-3 flex items-center">
          <button
            type='submit'
            className='bg-green-600 px-8 py-2 text-xl font-poppins capitalize rounded-2xl hover:bg-green-700 hover:cursor-pointer'
          >
            Join
          </button>
        </div>

        <p className='font-poppins text-center text-sm'>
          Don’t have an invite?{' '}
          <span
            className='text-green-500 hover:cursor-pointer hover:text-green-600 underline'
            onClick={handleNewRoom}
          >
            Create new room
          </span>
        </p>
      </form>
    </div>
  );
}

export default LandingPage;
