import React, { useContext } from 'react'
import AuthContext from '../shared/auth-context';
import { useHttpClient } from '../shared/http-hook'

const SingleCommentItem = props => {
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext)

// Delete comment from the db
    const deleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/comments/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id)

    } catch (err) {}
  }

    return (
        <tr>
            <td className="Info">{props.writer}</td>
            <td className="Info">{props.content}</td>
            <td className="Info">{props.created_at}</td>
            <td className="Icons">
              <i className="fas fa-edit" onClick={() => window.location=`/update/comment/${props.id}`}></i> |  
              <i className="fas fa-trash-alt" onClick={deleteHandler}></i>
            </td>   
        </tr>
    )
  }
  
  export default SingleCommentItem;