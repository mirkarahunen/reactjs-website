import React, { useContext } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'
import AuthContext from '../shared/auth-context'
import './SingleUser.css'
import SingleUserItem from './SingleUserItem'

const SingleUser = props => {
  
  const { isLoading, sendRequest } = useHttpClient()
  const auth = useContext(AuthContext)

  // Remove user from the db and log him out automatically
  const deleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/users/${props.items.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      ); 
      props.onDelete(props.items.id);
      auth.logout(props.items.id)
    } catch (err) {}

    
  }

    return(
      <div className="Profile">
        {isLoading && <LoadingSpinner asOverlay />} 
        <div className="Profile-image">
          
          <img alt="Profile" src={`http://localhost:5000/${props.items.image}`} />      
        </div>
        <h5>{props.items.firstname}</h5>

        <div className="User-information">
          <table>
            <SingleUserItem 
              key={props.items.id}
              id={props.items.id}
              firstname={props.items.firstname}
              lastname={props.items.lastname}
              email={props.items.email}
              image={props.items.image}   
            />        
          </table>
          <button className="Edit-profile" onClick={() => window.location=`/update/${props.items.id}`}>Edit Profile</button>
          <button className="Delete-profile" onClick={deleteHandler}>Delete profile</button>
          
        </div>
      </div>
    )
  }


export default SingleUser