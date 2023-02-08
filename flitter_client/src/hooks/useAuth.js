import useApi from "./useApi";
import useAuthContext from "./useAuthContext";

const useAuth = () => {
    const api = useApi();
    const { setUser } = useAuthContext();

    const authenticate = async (values, url) => {
        try {
            const response = await api.post(url, values);
            logIn(response.data.token);
            return;
        } catch (error) {
            let message = "Vaya, algo salió mal, inténtalo de nuevo.";

            if (error.status === 409 || error.response.status === 409) {
                message = "Usuario ya existe con eses datos.";
            }

            if (error.status === 401 || error.response.status === 401) {
                message = "Usuario no autorizado.";
            }

            if (error.status === 422 || error.response.status === 422) {
                message = "Datos no rellenados correctamente.";
            }

            return message;
        }
    }

    const logIn = (token) => {
        localStorage.setItem("token", token);
        const encondedPayload = token.split(".")[1];
        setUser(JSON.parse(atob(encondedPayload)));
    }

    const logOut = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    const unsubscribe = async (id) => {
        try {
            const response = await api.delete(`unsubscribe/${id}`);
            return response.data;
        } catch (error) {
            let message = "Vaya, algo salió mal, inténtalo de nuevo.";

            if (error.status === 401 || error.response.status === 401) {
                message = "Usuario no autorizado.";
            }

            return { error: message };
        }
    }

    const updateUser = async (params) => {
        try {
            const response = await api.put('update-user', params);
            logIn(response.data.token);
            return true;
        } catch (error) {
            return false;
        }
    }

    return { authenticate, logOut, unsubscribe, updateUser };
}

export default useAuth;