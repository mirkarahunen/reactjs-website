import React, { useEffect, useState, useContext } from 'react'
import SingleUser from './SingleUser'

import LoadingSpinner from '../shared/LoadingSpinner';
import { useHttpClient } from '../shared/http-hook'
import AuthContext from '../shared/auth-context';

const Profile = () => {
    const auth = useContext(AuthContext)
    const [loadedUser, setLoadedUser] = useState()
    const { isLoading, sendRequest } = useHttpClient()

    const userId = auth.userId


  useEffect(() => {
    // Fetch current users information from db
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/users/${userId}`
        );
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId]);

  // Delete user account and automatically log out removed user
  const userDeletedHandler = deletedUserId => {     
    auth.logout(deletedUserId)
};

  return (
    <React.Fragment>
      
      {isLoading && (<LoadingSpinner asOverlay/>)}
      {!isLoading && loadedUser && (
        <SingleUser items={loadedUser} onDelete={userDeletedHandler} />
      )}
    </React.Fragment>
  )
    
}

export default Profile;