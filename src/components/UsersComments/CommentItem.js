import React from 'react'
import SingleCommentItem from './SingleCommentItem'
import '../Users/UsersList.css'

// Render all comments in a table
const CommentItem = props => {
    if (props.items.length === 0) {
        return(
          <div className="Users-table">
              <h3>No comments found</h3>
          </div>
        )
    } else {
      return(
          <div className="Users-table">
              <h3>All comments</h3>
                  <table>
                      <thead>
                          <tr>
                              <td className="Head">User</td>
                              <td className="Head">Content</td>
                              <td className="Head">Created at</td>
                              <td className="Head">Edit</td>
                          </tr>
                      </thead>
                      <tbody>
                          
                      {props.items.map(comment => {
                          return (
                          <SingleCommentItem
                              key={comment.id}
                              id={comment.id}
                              writer={comment.writer}
                              content={comment.content}
                              created_at={comment.created_at}
                              onDelete={props.onDelete}
                          />
                      )})}
                      </tbody>
                  </table>
              </div>
      )
  }
}

export default CommentItem;