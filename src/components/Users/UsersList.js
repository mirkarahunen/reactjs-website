import React from 'react'
import UserItem from './UserItem'
import './UsersList.css'

// Render all users
  const UsersList = props => {
      if (props.items.length === 0) {
          return(
            <div className="Users-table">
                <h3>No users found</h3>
            </div>
          )
      } else {
        return(
            <div className="Users-table">
                <h3>All users</h3>
                    <table>
                        <thead>
                            <tr>
                                <td className="Head">Firstname</td>
                                <td className="Head">Lastname</td>
                                <td className="Head">Email</td>
                                
                                <td className="Head">Created at</td>
                                <td className="Head">Edit</td>
                            </tr>
                        </thead>
                        <tbody>
                            
                        {props.items.map(user => {
                            return (
                            <UserItem
                                key={user.id}
                                id={user.id}
                                firstname={user.firstname}
                                lastname={user.lastname}
                                email={user.email}
                                created_at={user.created_at}
                                onDelete={props.onDelete}
                            />
                        )})}
                        </tbody>
                    </table>
                </div>
        )
    }
}

export default UsersList;