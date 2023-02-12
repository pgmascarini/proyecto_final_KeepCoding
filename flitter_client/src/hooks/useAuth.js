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

    const forgotPassword = async ({ email }) => {
        try {
            await api.post('forgot-password', { email });
            return {
                description: "Ha ido todo bien, te enviamos un correo electrónico con los pasos para recuperar tu contraseña",
                type: "success"
            };
        } catch (error) {
            const message = {
                description: "Vaya, algo salió mal, inténtalo de nuevo.",
                type: "danger"
            }

            if (error.status === 401 || error.response.status === 401) {
                message.description = "Usuario no autorizado.";
            }

            return message;
        }
    }

    const resetPassword = async (values, resetPasswordCode) => {
        try {
            const response = await api.put(`reset-password/${resetPasswordCode}`, values);
            logIn(response.data.token);
            return;
        } catch (error) {
            let message = "Vaya, algo salió mal, inténtalo de nuevo.";

            if (error.status === 401 || error.response.status === 401) {
                message = "Usuario no autorizado.";
            }

            if (error.status === 422 || error.response.status === 422) {
                message = "Datos no rellenados correctamente.";
            }

            return message;
        }

    }

    return { authenticate, logOut, unsubscribe, updateUser, forgotPassword, resetPassword };
}

export default useAuth;