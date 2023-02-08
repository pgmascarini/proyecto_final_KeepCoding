import { useState } from 'react';

import { Button, Modal } from 'react-bootstrap';

const Confirmation = ({ label, description, callback }) => {
    const [show, setShow] = useState();

    return (
        <>
            <Button variant="danger" style={{ float: "right" }} onClick={() => setShow(true)}>{label}</Button>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Confirmación
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿{description}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={callback}>Si, adelante</Button>
                    <Button variant="secondary" onClick={() => setShow(false)}>No</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Confirmation;