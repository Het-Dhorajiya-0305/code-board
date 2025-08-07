import React, { useRef, useEffect, useContext, useState } from 'react';
import Avatar from 'react-avatar';
import { storeContext } from '../context/storeContext';
import CodeEditor from '../component/codeEditor';
import { initSocket } from '../socket';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import logo from '../assets/logo.png';

function EditorPage() {
  const socketRef = useRef(null);
  const { roomId } = useParams();
  const { email, username, language, navigate, clearUserData } = useContext(storeContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      const socket = socketRef.current;

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

      const handleBeforeUnload = () => {
        socket.emit('leave-room', { roomId, username });
        socket.disconnect();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      // Handle browser back navigation
      const handlePopState = () => {
        socket.emit('leave-room', { roomId, username });
        socket.disconnect();
        navigate('/');
      };

      window.addEventListener('popstate', handlePopState);

      // Cleanup on unmount
      return () => {
        socket.emit('leave-room', { roomId, username });
        socket.disconnect();
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
        socketRef.current = null;
      };
    };

    if (roomId && username) {
      init();
    } else {
      // If user refreshed without username, try to redirect them to landing
      navigate('/');
    }
  }, [roomId, username, navigate]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied!');
  };

  const leaveRoom = () => {
    clearUserData();
    socketRef.current?.emit('leave-room', { roomId, username });
    socketRef.current?.disconnect();
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
              <div key={user.userId} className="flex flex-col items-center capitalize gap-1">
                <Avatar name={user.username} size="50" className="rounded-full" />
                {user.username}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleCopyRoomId}
              className="bg-white px-4 py-2 text-black rounded-2xl font-bold hover:bg-gray-500 transition-all duration-300"
            >
              Copy Room Code
            </button>
            <button
              onClick={leaveRoom}
              className="bg-green-500 px-4 py-2 text-black rounded-2xl font-bold hover:bg-green-600 transition-all duration-300"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
      <div className="w-5/6 h-full max-xl:w-4/5 max-lg:w-3/4">
        <CodeEditor language={language} />
      </div>
    </div>
  );
}

export default EditorPage;
