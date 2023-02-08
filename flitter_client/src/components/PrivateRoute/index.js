import { Navigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext"

const PrivateRoute = ({ children }) => {
    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/log-in" replace />;
    }

    return children;
};

export default PrivateRoute;