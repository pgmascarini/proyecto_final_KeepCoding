import { useContext } from "react"
import { FlittersContext } from "../contexts/FlittersContext";

const useFlittersContext = () => {
    const flittersContext = useContext(FlittersContext);

    if (flittersContext === null) {
        throw new Error("dataContext must be used within a DataContext tag");
    }

    return flittersContext;
}

export default useFlittersContext;