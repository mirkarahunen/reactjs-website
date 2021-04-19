import React, { useEffect, useState } from 'react'
import CommentItem from './CommentItem'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'
import './UsersComments.css'


const UsersComments = () => {
    const [comments, setComments ] = useState()
    const { isLoading, sendRequest } = useHttpClient()

    useEffect(() => {
      // Fetch all comments from db
      const fetchComments = async () => {
        try {
            const commentsData = await sendRequest(`http://localhost:5000/comments`)
          
            setComments(commentsData.comments) 

        } catch (error) {}
      }
      fetchComments() 
    
    }, [sendRequest])

    // Delete commenst with id
    const commentDeletedHandler = deletedCommentId => {
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== deletedCommentId)          
      );  
  };

    return (
        <div className="Users-comments">
          {isLoading && (<LoadingSpinner asOverlay/>)}
          {!isLoading && comments && (
            <CommentItem items={comments} onDelete={commentDeletedHandler}/>
          )}
           
        </div>
      )
}

export default UsersComments