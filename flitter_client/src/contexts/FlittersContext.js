import { createContext, useState } from "react";

export const FlittersContext = createContext();

export const FlittersContextProvider = ({ children }) => {
    const [flitters, setFlitters] = useState([]);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    return (
        <FlittersContext.Provider value={{ flitters, setFlitters, page, setPage, isLastPage, setIsLastPage }}>
            {children}
        </FlittersContext.Provider>
    );
}