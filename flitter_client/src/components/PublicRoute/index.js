import { Navigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext"

const PublicRoute = ({ children }) => {
    const { user } = useAuthContext();

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;