import React from 'react';
import './Comment.css';

const Comment = (props) => {
    const date = props.date.substr(0, 10)
    return (
        <div className="comment">
            <h4>Autor: {props.author}</h4>
            <h6>{date}</h6>
            <p>{props.text}</p>
        </div>
    );
}

export default Comment;