import React from 'react';
import './CommentItems.css'
import SingleCommentItem from './SingleCommentItem'

const CommentItem = props => {

    if (props.items.comments.length === 0) {
      
        return(
          <div className="Uploaded-comments-section">
            <div className="Comments-header">
              <h3>No Comments on this playlist yet</h3>
            </div>
          </div>
        )
    } else {
        return(
            <div className="Uploaded-comments-section">
              <div className="Comments-header">
                <h4>Comments</h4>
              </div>
              <div>
                
              {props.items.comments.map((item, i) => 
             
                <SingleCommentItem 
                  key={i}
                  id={item.id}
                  content={item.content}
                  writer={item.writer}
                  created={item.created_at}
                  writerImage={item.writerImage}
                  
                   />
                   
              )}
             </div>     
            </div>
        )
    }
}

export default CommentItem