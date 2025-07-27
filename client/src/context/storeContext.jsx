import { createContext } from "react";
import { useNavigate } from "react-router-dom";


export const storeContext = createContext(null);

const StoreContextProvider = (props) => {

    const navigate=useNavigate();


    const contexValue = {navigate};

    return (
        <storeContext.Provider value={contexValue}>
            {props.children}
        </storeContext.Provider>
    )
}

export default StoreContextProvider;