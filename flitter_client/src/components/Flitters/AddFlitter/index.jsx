/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import moment from "moment";
import useFlitter from "../../../hooks/useFlitter";

import Loading from "../../Loading";
import { Alert, Button, Form, Image, Modal } from 'react-bootstrap';

const AddFlitter = () => {
    const [image, setImage] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [publicationDate, setPublicationDate] = useState(moment().format('YYYY-MM-DD'));
    const { addFlitter } = useFlitter();

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleUpload = async (file) => {
        const base64 = await convertToBase64(file);
        setImage(base64);
    }

    const formSubmit = async () => {
        setIsLoading(true);
        const response = await addFlitter({ description, image, publicationDate });
        if (response) {
            setError(response);
        } else {
            setError(null);
            setShow(false);
            setImage("");
            setDescription("");
            setPublicationDate(moment().format('YYYY-MM-DD'));
        }
        setIsLoading(false);
    }

    const isDateValid = () => {
        const currentDate = moment().subtract(1, 'day');
        const isAfter = currentDate.isAfter(publicationDate);
        return !isAfter;
    }

    return (
        <>
            <a href="#" className="p-2" style={{ cursor: "pointer" }} onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setShow(true);
                return false;
            }}>
                Add Flit
            </a>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Flit
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading && <Loading />}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Descripción</Form.Label>
                        <textarea className="form-control" style={{ overflow: "auto", resize: "none" }} placeholder="¿Que pasa?" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" maxLength={256}></textarea>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="publicationDate">
                        <Form.Label>Fecha de publicación</Form.Label>
                        <input className="form-control text-muted" style={{ borderColor: !isDateValid() ? "#dc3545" : "" }} type="date" name="publicationDate" id="publicationDate" min={moment().format('YYYY-MM-DD')} value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} />
                        {!isDateValid() && (
                            <Form.Control.Feedback type="invalid" className="d-block px-2">
                                La fecha de publicación no puede ser anterior a fecha de hoy.
                            </Form.Control.Feedback>
                        )}

                    </Form.Group>
                    {!image && (
                        <Form.Group controlId="image">
                            <Form.Label className="form-control text-muted m-0" style={{ cursor: "pointer" }}>Cargar image</Form.Label>
                            <input type="file" id="image" name="image" accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} style={{ visibility: "hidden", height: 0 }} />
                        </Form.Group>
                    )}
                    {image && (
                        <div style={{ position: "relative" }}>
                            <Image src={image} fluid={true} rounded={true} className="mb-3" />
                            <Button style={{ position: "absolute", bottom: "30px", right: "10px" }} variant="danger" onClick={() => setImage("")}>Borrar</Button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" disabled={!isDateValid() || (!image && !description)} onClick={formSubmit}>Add Flit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddFlitter;