import React, {useEffect, useState } from "react";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';

const {ShareButton} = require('./ShareButton.js');
const {ClipboardButton} = require('./ClipboardButton.js');

export function ShareGameModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const shareURL = new URL(window.location.origin + '/invite');
    const params = (new URL(document.location)).searchParams;
    let gid = params.get('gid');
    shareURL.searchParams.append("gid", gid);
    shareURL.searchParams.append("mode", "REMOTEJOIN");
    const shareData = {
        title: 'HiveMind',
        text: "Let's play a game of online Hive, shall we?",
        url: shareURL.href
    };
    return (
        <>
        <Button variant="primary" onClick={handleShow}>
            Invite
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> Share the link to this game </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ClipboardButton url={shareURL.href} />
                <ShareButton data={shareData} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  );
}
