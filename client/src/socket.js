import { io } from 'socket.io-client';


const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const initSocket = async () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 5000,
        transports: ['websocket']
    };

    return io(backendUrl, options);
};
