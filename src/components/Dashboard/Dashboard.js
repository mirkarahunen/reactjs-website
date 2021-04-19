import React, { useState, useEffect, useContext } from 'react'
import './Dashboard.css'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'
import AuthContext from '../shared/auth-context'
import ListsItem from './ListsItems'
import MatchItem from './MatchItem'

const Dashboard = () => {
  const auth = useContext(AuthContext)
  const userId = auth.userId
  const token = auth.token
  const { sendRequest } = useHttpClient()
  const [loadedPlaylists, setLoadedPlaylists] = useState([])
  const [user, setUser] = useState([])
  const { isLoading } = useHttpClient()
  

  useEffect(() => {
    let match;
    let matchID;
    let newMatches = [];

    // Get playlists from the db
    const getPlaylists = async () => {
        try {
            const response = await fetch('http://localhost:5000/playlists')
            const responseData = await response.json()
            setLoadedPlaylists(responseData.playlists) 

  /*----------  Filter playlists where creatorId = userId and likes length is not 0 
  -> get playlists of the user that have been liked  ---------*/

  let currentUsersPlaylists = responseData.playlists.filter(playlist => playlist.creatorId === userId)
  let currentUsersPlaylistsWithLikes = currentUsersPlaylists.filter(playlist => playlist.likes.length !== 0)
 
  /*----------  Get the userId of the user who has liked the playlists of current user  ---------*/   
  let usersWhoLikedPlaylists = currentUsersPlaylistsWithLikes.map(playlist => playlist.likes).flat()
  //console.log(usersWhoLikedPlaylists);

  /*----------  Get playlists and their ids which the current user has liked ---------*/
  let playlistsCurrentUserLiked = responseData.playlists.filter(playlist => playlist.likes.includes(userId))
  let playlistsCurrentUserLikedUserID = playlistsCurrentUserLiked.map(playlist => playlist.creatorId)
 
  /*---------  Check for match between users  ---------*/
//console.log(playlistsCurrentUserLikedUserID);
playlistsCurrentUserLikedUserID.forEach(element => {

    // convert object element to string
    match = element.split().toString();
    //console.log(match);

    //check if usersWhoLikedPlaylists array already has the match ids 
    usersWhoLikedPlaylists.includes(match);
    newMatches.push(match)
    //console.log(newMatches);
  }) 
 
} catch (error) {}
        
}  
getPlaylists()

// Get user information from db
const getUserInfo = async () => {
  const response = await sendRequest(`http://localhost:5000/users/${userId}`)
  setUser(response.user.matches);      
    // Loop for array1 
    for(let i = 0; i <= response.user.matches.length; i++) { 
        // Loop for array2 
        for(let j = 0; j < newMatches.length; j++) { 
            // Compare the element of each and 
            // every element from both of the 
            // arrays 
            // Check if one of the new user ids in the newMatches array is already saved in the users matches
            if(response.user.matches.map(item => item.userID)[i] !== newMatches[j] || response.user.matches.length === 0) { 
              matchID = newMatches[j]
              // Update user information with the match id
              try {
                 const response = await fetch(`http://localhost:5000/users/${userId}/${token}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-type': 'application/json'
                  },
                  body: JSON.stringify({matches: {matchID}})
                 }) 
                  setUser(response.user.matches)
                } catch(err) {}    
            } 
        } 
    } 
      
    // Return if common elements exist 
    return;   
}
getUserInfo()



}, [userId, sendRequest, token])


  return(
    <div className="bg">
      {isLoading && (<LoadingSpinner asOverlay/>)}
      <h2>Welcome to</h2> 
      <h1>Beats</h1>

      <div className="newest">
        <h3>Your matches with other users</h3>
        <MatchItem matches={user}/>
      </div>

      <div className="newest">
        <h3>Newest Playlists</h3>
        <React.Fragment>
          
          {!isLoading && loadedPlaylists && (
        <ListsItem playlists={loadedPlaylists} /> 
      )}
      
    </React.Fragment>
      </div>
    </div>
  )
}

export default Dashboard