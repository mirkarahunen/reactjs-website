import React from 'react'
import './SingleCommentItem.css'

const SingleCommentItem = props => {
// Show comment writers information with image
    return(
        <div className="comment-items" >
            <div className="writer-created-section">
                <img alt="profile" src={`http://localhost:5000/${props.writerImage}`} />
                <p className="writer">{props.writer}</p>
                <p className="created">posted at: {props.created}</p>
            </div>
            <p className="comment-content">{props.content}</p>

        </div>
    )
}

export default SingleCommentItem