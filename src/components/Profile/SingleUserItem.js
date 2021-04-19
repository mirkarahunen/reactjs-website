import React from 'react'

const SingleUserItem = props => {
    return (
        <tbody>
            <tr>
                <td className="Head">Name:</td>
                <td className="Info">{props.firstname} {props.lastname}</td>
            </tr>
            <tr>
                <td className="Head">Email:</td>
                <td className="Info">{props.email}</td> 
            </tr>
        </tbody>
    )
  }
  
  export default SingleUserItem;