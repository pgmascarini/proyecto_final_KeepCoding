import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

import Menu from "../../components/Menu";
import Confirmation from "../../components/Confirmation";
import Loading from "../../components/Loading";
import { Alert, Col, Row } from "react-bootstrap";

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { unsubscribe, logOut } = useAuth();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleUsubscribe = async () => {
        setIsLoading(true);
        const response = await unsubscribe(user.id);
        if (!response.error) {
            logOut();
            navigate("/");
        } else {
            setError(response.error);
        }
        setIsLoading(false);
    }

    return (
        <Row>
        {isLoading && <Loading />}
            {user && (
                <Col md={4}>
                    <Menu />
                </Col>
            )}
            
            <Col md={8} className={!user ? "m-auto" : ''}>
                <h2>Mis datos</h2>
                <hr />
                {error && <Alert variant="danger">{error}</Alert>}
                <p><b>Nombre de usuario</b>: {user.username}</p>
                <p><b>Correo electrónico</b>: {user.email}</p>
                <Confirmation description="Está seguro de que desea darte de baja" callback={handleUsubscribe} label="Darme de baja" />
            </Col>
        </Row>
    );
}

export default Profile;