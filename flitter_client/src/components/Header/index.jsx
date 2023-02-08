import { Link } from 'react-router-dom';
import useAuthContext from "../../hooks/useAuthContext";
import useAuth from "../../hooks/useAuth"

import { Container, Navbar } from 'react-bootstrap';

const Header = () => {
    const { logOut } = useAuth();
    const { user } = useAuthContext();

    return (
        <Navbar>
            <Container>
                <Link to="/" className="text-primary brand navbar-brand">Flitter</Link>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {!user ?
                        <>
                            <Link className='btn btn-primary mx-2' to="/log-in">Log in</Link>
                            <Link className='btn btn-outline-secondary' to="/sign-up">Sign up</Link>
                        </> :
                        <Link className='btn btn-outline-secondary' to="/" onClick={() => logOut()}>Log out</Link>}
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}

export default Header;