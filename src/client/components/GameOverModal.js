import React, {useEffect, useState } from "react";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';

export function GameOverModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> The Game is over! </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button variant="primary" onClick={handleClose}>
                    Rematch
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    New Opponent
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Exit
                </Button>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    </>
  );
}
