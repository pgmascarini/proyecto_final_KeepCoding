import useApi from "./useApi";
import moment from "moment";
import useFlittersContext from "./useFlittersContext";

const useFlitter = () => {
    const api = useApi();
    const context = useFlittersContext();

    const getFlitters = async (params) => {
        let url = 'flitters'
        try {
            if (params) {
                const keys = Object.keys(params);
                keys.forEach((key, index) => {
                    url += `${index === 0 ? '?' : '&'}${key}=${params[key]}`
                });
            }

            const response = await api.get(url);

            if (params.page > 0) {
                context.setFlitters([...context.flitters, ...response.data.flitters]);
            } else {
                context.setFlitters(response.data.flitters);
            }

            context.setPage(response.data.page);
            context.setIsLastPage(response.data.isLastPage);
            return null;
        } catch (error) {
            let message = "Vaya, algo salió mal, inténtalo de nuevo.";

            if (error.status === 422 || error.response.status === 422) {
                message = "Datos no rellenados correctamente.";
            }

            return message;
        }
    }

    const addFlitter = async (params) => {
        try {
            const response = await api.post('flitters', params);
            const isBefore = moment(response.data.publicationDate).isBefore(moment());
            if(isBefore) {
                context.setFlitters([response.data, ...context.flitters]);
            }
            return null;
        } catch (error) {
            let message = "Vaya, algo salió mal, inténtalo de nuevo.";

            if (error.status === 409 || error.response.status === 409) {
                message = "Usuario ya existe con eses datos.";
            }

            if (error.status === 401 || error.response.status === 401) {
                message = "Usuario no autorizado.";
            }

            return message;
        }
    }

    const updateFlitter = async (id, params) => {
        try {
            await api.put(`flitters/${id}`, params);
            return true;
        } catch (error) {
            return false;
        }
    }


    const deleteFlitter = async (id) => {
        try {
            await api.delete(`flitters/${id}`);
            context.setFlitters(context.flitters.filter((flitter) => flitter._id !== id));
            return null;
        } catch (error) {
            let message = "Vaya, algo salió mal, inténtalo de nuevo.";

            if (error.status === 401 || error.response.status === 401) {
                message = "Usuario no autorizado.";
            }

            return message;
        }
    }

    return { getFlitters, addFlitter, updateFlitter, deleteFlitter };
}

export default useFlitter;