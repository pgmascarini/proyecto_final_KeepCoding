import useAuthContext from "../../hooks/useAuthContext";

import { Link } from "react-router-dom";
import AddFlitter from "../Flitters/AddFlitter";

const Menu = () => {
    const { user } = useAuthContext();


    return (
        <>
            <AddFlitter className="p-2" />
            <hr className="d-none d-md-block" />
            <Link className="p-2" to={`/${user.username}`}>Mis flits</Link>
            <hr className="d-none d-md-block" />
            <Link className="p-2" to={`/following`}>Siguiendo</Link>
            <hr className="d-none d-md-block" />
            <Link className="p-2" to={'/profile'}>Mi perfil</Link>
            <hr />
        </>
    )
}

export default Menu;