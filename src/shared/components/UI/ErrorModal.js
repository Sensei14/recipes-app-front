import React from "react";
import Modal from "react-bootstrap/Modal";
import "./ErrorModal.css";

const ErrorModal = props => {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      dialogClassName={props.type}
    >
      <Modal.Header>
        <Modal.Title>
          {props.type === "error" ? "WYSTĄPIŁ BŁĄD!" : "OSTRZEŻENIE"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.error}</Modal.Body>
      <Modal.Footer>
        {props.type === "warning" ? (
          <button onClick={props.onConfirm}>POTWIERDŹ</button>
        ) : null}
        <button onClick={props.handleClose}>ZAMKNIJ</button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
