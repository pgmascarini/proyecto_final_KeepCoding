/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import useFlitter from "../../hooks/useFlitter";
import useAuthContext from "../../hooks/useAuthContext";
import useFlittersContext from "../../hooks/useFlittersContext";

import Flitter from "./Flitter";
import Loading from "../Loading";
import { Alert, Button, Container, Form, InputGroup } from 'react-bootstrap';

const Flitters = () => {
    const { author } = useParams();
    const { user } = useAuthContext();
    const { pathname } = useLocation();
    const { updateUser } = useAuth();
    const context = useFlittersContext();
    const { getFlitters } = useFlitter();
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [follow, setFollow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (page = 0) => {
        setIsLoading(true);
        const params = { page };

        if (search) {
            params.search = search;
        }

        if (author) {
            params.author = author;
        }

        if (pathname === "/following") {
            params.following = user.following;
        }

        const response = await getFlitters(params);
        if (response) {
            setError(response);
        }

        setIsLoading(false);
    }

    const handleFollow = async () => {
        const toggle = !follow;
        setFollow(toggle);

        if (toggle) {
            user.following.push(author);
        } else {
            const index = user.following.indexOf(author);
            if (index > -1) {
                user.following.splice(index, 1);
            }
        }

        const response = await updateUser({ toggle, author });
        if (!response) {
            setFollow(!toggle);
        }
    }

    useEffect(() => {
        if (user && author) {
            const f = user.following.find((item) => item === author);
            if (f) {
                setFollow(true)
            } else {
                setFollow(false);
            }
        }

        fetchData();
    }, [author]);

    return (
        <Container>
            {isLoading && <Loading />}
            {!isLoading && (
                <>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {!error && author && (
                        <>
                            <h2>
                                {author}
                                {user && author !== user.username && <Button variant={follow ? 'success' : 'secondary'} style={{ float: "right" }} onClick={handleFollow}>{!follow ? "Seguir" : "Dejar de seguir"}</Button>}
                            </h2>
                            <hr />
                        </>
                    )}
                    {!error && context.flitters && (
                        <InputGroup className="mb-3">
                            <Form.Control type="text" placeholder="Buscar flitters" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button variant="secondary" onClick={() => fetchData()}>Buscar</Button>
                        </InputGroup>
                    )}
                    {!error && context.flitters.length === 0 && <Alert variant="info">No hay resultados para mostrarse.</Alert>}
                    {!error && context.flitters.length > 0 && context.flitters.map((flitter) => <Flitter key={flitter._id} flitter={flitter} />)}
                    {!error && !context.isLastPage && <Button variant="link" className="mb-5" onClick={() => fetchData(Number(context.page) + 1)}>+ Mas flitters</Button>}
                </>
            )}
        </Container>
    )
}

export default Flitters;