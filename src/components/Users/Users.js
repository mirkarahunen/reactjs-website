import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'
import UsersList from './UsersList'

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState()
    const { isLoading } = useHttpClient()
    
    useEffect(() => {
        // Fetch all users information from the db
        const sendRequest = async () => {
            try {
                const response = await fetch('http://localhost:5000/users')

                const responseData = await response.json()
                
                if(!response.ok) {
                    throw new Error(responseData.message)
                }
                setLoadedUsers(responseData.users) 
            } catch (error) {}
            
        }
        sendRequest()
    }, [])

    // Delete user with id
    const userDeletedHandler = deletedUserId => {
        setLoadedUsers(prevUsers =>
          prevUsers.filter(user => user.id !== deletedUserId)          
        );  
    };

    return(
        <React.Fragment>
            {isLoading && (<LoadingSpinner asOverlay/>)}
            {loadedUsers && <UsersList items={loadedUsers} onDelete={userDeletedHandler} />}
            
        </React.Fragment>
        
    )
}

export default Users