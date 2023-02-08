import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const token = localStorage.getItem("token");
    const [user, setUser] = useState((token ? JSON.parse(atob(token.split(".")[1])) : null));

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}