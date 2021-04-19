import React, { useEffect, useState, useContext }  from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Input from '../shared/Input/Input'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorMsg from '../shared/Error/ErrorMsg'
import { VALIDATOR_REQUIRE } from '../../util/Validators/Validators'
import { useForm } from '../shared/form-hook';
import { useHttpClient } from '../shared/http-hook';
import AuthContext from '../shared/auth-context';

const UpdateComment = () => {
    const commentId = useParams().id
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest } = useHttpClient()
    const [loadedComment, setLoadedComment] = useState()
    const history = useHistory()

    // Set initial form values
    const [formState, inputHandler, setFormData] = useForm(
        {
          content: {
            value: '',
            isValid: false
          }
        },
        false
      );
    
      useEffect(() => {
        // Fetch comment with the id from db
        const fetchComment = async () => {
          try {
            const responseData = await sendRequest(
              `http://localhost:5000/comments/${commentId}`
            );
            setLoadedComment(responseData.comment);
            
            // Set form data with response data
            setFormData(
              {
                content: {
                  value: responseData.comment.content,
                  isValid: true
                }
              },
              true
            );
            
          } catch (err) {}
        };
        fetchComment();
        
      }, [sendRequest, commentId, setFormData]);

      // Update selected comment with new input data and save it to db
      const commentUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
          await sendRequest(
            `http://localhost:5000/comments/${commentId}`,
            'PATCH',
            JSON.stringify({
                content: formState.inputs.content.value
              }),
              {
                Authorization: 'Bearer ' + auth.token,
                'Content-Type': 'application/json'
              }
            );
          history.push('/comments');
        } catch (err) {}
      };

      if (isLoading) {
        return (
          <div className="center">
            <LoadingSpinner asOverlay/>
          </div>
        );
      }
    
      if (!loadedComment) {
        return (
          <div className="center">
            <h3>Could not find comment info!</h3>
          </div>
        );
      }

      return (
    <React.Fragment>
      <ErrorMsg error={error} />
      {!isLoading && loadedComment && ( 
        <form className="form" onSubmit={commentUpdateSubmitHandler}>
          <h3>Update comment</h3>
          <Input
            id="content"
            element="input"
            type="text"
            label="Content"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid comment"
            onInput={inputHandler}
            initialValue={loadedComment.content}
            initialValid={true}
          />
         
          <button type="submit" className="Update-profile" disabled={!formState.isValid}>
            Update comment
          </button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdateComment