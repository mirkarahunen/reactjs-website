import React, { useContext } from 'react'
import AuthContext from '../shared/auth-context';
import { useHttpClient } from '../shared/http-hook'

const UserItem = props => {
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext)

    // Delete user from the db
    const deleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/users/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id)

    } catch (err) {}
  }
// Render all users in a table
    return (
        <tr>
            <td className="Info">{props.firstname}</td>
            <td className="Info">{props.lastname}</td>
            <td className="Info">{props.email}</td>
            <td className="Info">{props.created_at}</td>
            <td className="Icons">
              <i className="fas fa-edit" onClick={() => window.location=`/update/user/${props.id}`}></i> | 
              <i className="fas fa-trash-alt" onClick={deleteHandler}></i>
              </td>   
        </tr>
    )
  }
  
  export default UserItem;