/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFlitter from "../../../hooks/useFlitter";
import useAuthContext from "../../../hooks/useAuthContext";
import moment from "moment";

import Loading from "../../Loading";
import Confirmation from "../../Confirmation";
import { Alert, Card, Button } from "react-bootstrap";

const Flitter = ({ flitter }) => {
    const { user } = useAuthContext();
    const [kudo, setKudo] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const { updateFlitter, deleteFlitter } = useFlitter();

    const handleKudo = async () => {
        const toggle = !kudo;
        setKudo(toggle);

        if (toggle) {
            flitter.kudos.push(user.username);
        } else {
            const index = flitter.kudos.indexOf(user.username);
            if (index > -1) {
                flitter.kudos.splice(index, 1);
            }
        }

        const response = await updateFlitter(flitter._id, { user: toggle ? user.username : "" });
        if (!response) {
            setKudo(!toggle);
        }
    }

    const handleDelete = async () => {
        setError(null);

        setIsLoading(true);
        const response = await deleteFlitter(flitter._id);
        if (response) {
            setError(response);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        if (user) {
            const k = flitter.kudos.find((item) => item === user.username);
            if (k) {
                setKudo(true)
            } else {
                setKudo(false);
            }
        }
    }, []);

    return (
        <>
            {isLoading && <Loading />}
            {error && <Alert variant="danger">{error}</Alert>}
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>
                        <Link to={`/${flitter.author}`}>{flitter.author}</Link> - <span className="text-muted" style={{ fontSize: "0.9rem" }}>{moment(flitter.publicationDate).format("DD/MM/YYYY")}</span>
                        {user && user.username === flitter.author && <Confirmation description="Está seguro de que desea eliminar este flit" callback={handleDelete} label="Delete" />}
                    </Card.Title>
                    {flitter.description && <Card.Text className="my-3">{flitter.description}</Card.Text>}
                    {flitter.image && <Card.Img className="my-3" src={flitter.image} />}
                    <Card.Subtitle className="text-muted d-inline-block">{flitter.kudos.length} kudos</Card.Subtitle>
                    {user && user.username !== flitter.author && <Button style={{ float: "right" }} variant={kudo ? 'success' : 'secondary'} onClick={handleKudo}>{kudo ? "Unkudo" : "Kudo"}</Button>}
                </Card.Body>
            </Card>
        </>
    )
}

export default Flitter;