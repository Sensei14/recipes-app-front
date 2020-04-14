import React, { useState } from 'react';
import './Comments.css';
import Input from '../../shared/components/Form/Input';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttp } from '../../shared/hooks/http-hook';
import { useAuth } from '../../shared/hooks/auth-hook';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Comment from './Comment';
import Modal from "react-bootstrap/Modal";
import ModalBody from 'react-bootstrap/ModalBody';


const Comments = (props) => {
    const [formState, inputHandler] = useForm({ comment: { value: "", isValid: false } }, false)
    const { sendRequest, error, clearError, isLoading } = useHttp();
    const auth = useAuth();
    const [addCommentModal, setAddCommentModal] = useState(false)

    const addCommentHandler = (e) => {
        e.preventDefault();
        const comment = {
            text: formState.inputs.comment.value,
            recipeId: props.recipeId
        }
        const addComment = async () => {
            const responseData = await sendRequest('http://localhost:5000/api/recipes/comment', 'POST', JSON.stringify(comment), {
                Authorization: 'Bearer ' + auth.token,
                "Content-Type": "application/json"
            })
            if (responseData && responseData.status === 201) {
                setAddCommentModal(true)
            }
        }
        addComment();
    }

    const clearAddCommentModal = () => {
        setAddCommentModal(false);
    }



    const comments = props.comments.map(comment => <Comment key={comment.date} author={comment.author} text={comment.text} date={comment.date} />)
    return (
        <>
            <ErrorModal show={!!error} handleClose={clearError} type="error" error={error} />

            <div className="comments">
                <form onSubmit={addCommentHandler}>
                    <Input id="comment" validators={[VALIDATOR_MINLENGTH(5)]} onInput={inputHandler} errorText="Komentarz jest za krótki" rows="4" placeholder="Dodaj komentarz..." />
                    <button type="submit" className="add-comment-btn">Dodaj komentarz</button>
                </form>
                {comments}
            </div>
            <Modal
                show={addCommentModal}
                onHide={clearAddCommentModal}
                style={{ marginTop: '10%' }}
            >
                <ModalBody>
                    Dodano komentarz
        </ModalBody>
            </Modal>
        </>
    );
}

export default Comments;