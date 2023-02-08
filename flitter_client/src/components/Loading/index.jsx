import Spinner from 'react-bootstrap/Spinner';

import "./Loading.css"

const Loading = () => {
    return (
        <div className='loading'>
            <Spinner animation="border" role="status" variant='primary'>
                <span className="visually-hidden">Cargando...</span>
            </Spinner>
        </div>
    );
}

export default Loading;