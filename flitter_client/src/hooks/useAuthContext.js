import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext";

const useAuthContext = () => {
    const authContext = useContext(AuthContext);

    if (authContext === null) {
        throw new Error("dataContext must be used within a DataContext tag");
    }

    return authContext;
}

export default useAuthContext;