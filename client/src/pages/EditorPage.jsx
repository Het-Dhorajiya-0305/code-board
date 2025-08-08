import React, { useRef, useEffect, useContext, useState } from 'react';
import Avatar from 'react-avatar';
import { storeContext } from '../context/storeContext';
import CodeEditor from '../component/codeEditor';
import { initSocket } from '../socket';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import logo from '../assets/logo.png';

const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

function EditorPage() {
  const socketRef = useRef(null);
  const { roomId } = useParams();
  const { username, navigate, setRoomCodeState, setUsernameState } = useContext(storeContext);
  const [users, setUsers] = useState([]);
  const [typeUser, setTypeUser] = useState('');

  useEffect(() => {
    let socket;

    const handleBeforeUnload = () => {
      if (socket) {
        socket.emit('leave-room', { roomId, username });
        socket.disconnect();
      }
    };

    const handlePopState = () => {
      if (socket) {
        socket.emit('leave-room', { roomId, username });
        socket.disconnect();
      }
      setRoomCodeState('');
      setUsernameState('');
      localStorage.removeItem('roomCode');
      localStorage.removeItem('username');
    };

    const init = async () => {
      socket = await initSocket();
      socketRef.current = socket;

      socket.on('connect_error', handleErrors);
      socket.on('connect_failed', handleErrors);

      function handleErrors(err) {
        console.error('Socket error:', err);
        toast.error('Socket connection failed. Try again later.');
        navigate('/');
      }

      socket.emit('join', { roomId, username });

      socket.on('room-users', (userList) => {
        setUsers(userList);
      });

      socket.on('user-joined', ({ username }) => {
        toast.success(`${username} joined the room`);
      });

      socket.on('user-left', ({ username }) => {
        toast.info(`${username} left the room`);
      });

      socket.on('user-typing', ({ username }) => {
        setTypeUser(username);
        setTimeout(() => {
          setTypeUser('');
        }, 1000);
      })



      window.history.pushState(null, '', window.location.href);


      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
    };

    if (roomId && username) {
      init();
    } else {
      navigate('/');
    }

    return () => {
      if (socket) {
        socket.emit('leave-room', { roomId, username });
        socket.disconnect();
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      socketRef.current = null;
    };
  }, [roomId, username, navigate]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied!');
  };

  const leaveRoom = () => {
    socketRef.current?.emit('leave-room', { roomId, username });
    socketRef.current?.disconnect();
    setRoomCodeState('');
    setUsernameState('');
    localStorage.removeItem('roomCode');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-1/6 bg-neutral-800 h-full px-4 py-2 flex flex-col max-xl:w-1/5 max-lg:w-1/4">
        <div className="flex items-center justify-start gap-2 w-full h-lg p-4 border-b-2 border-neutral-700">
          <img src={logo} alt="logo" className="rounded-full w-13 max-lg:w-11" />
          <div className="capitalize font-poppins flex flex-col gap-1">
            <h1 className="text-xl font-bold max-lg:text-[15px]">codeboard</h1>
            <h2 className="text-green-700 font-bold text-[9px]">realtime code collaboration</h2>
          </div>
        </div>
        <div className="w-full h-6/7 flex flex-col gap-4 justify-between">
          <div className="flex gap-4 items-center flex-wrap p-4">
            {users.map((user) => (
              <div key={user.userId} className={`flex flex-col items-center capitalize gap-1`}>
                <Avatar name={user.username} size="50" className={`rounded-full ${typeUser === user.username ? 'ring-3 ring-green-700' : ''}`} />
                {user.username}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleCopyRoomId}
              className="bg-white px-4 py-2 text-black rounded-2xl font-bold hover:bg-gray-500 hover:cursor-pointer transition-all duration-300"
            >
              Copy Room Code
            </button>
            <button
              onClick={leaveRoom}
              className="bg-green-500 px-4 py-2 text-black rounded-2xl font-bold hover:bg-green-600 hover:cursor-pointer transition-all duration-300"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
      <div className="w-5/6 h-full max-xl:w-4/5 max-lg:w-3/4">
        <CodeEditor
          socketRef={socketRef}
          roomId={roomId}
          username={username}
        />
      </div>
    </div>
  );
}

export default EditorPage;
