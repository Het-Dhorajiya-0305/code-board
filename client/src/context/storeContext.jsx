import { createContext ,useState} from "react";
import { useNavigate } from "react-router-dom";



export const storeContext = createContext(null);

const StoreContextProvider = (props) => {

    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState('');
    const [username, setUsername] = useState('');


    const contexValue = { navigate,roomCode,setRoomCode,setUsername,username };

    return (
        <storeContext.Provider value={contexValue}>
            {props.children}
        </storeContext.Provider>
    )
}

export default StoreContextProvider;