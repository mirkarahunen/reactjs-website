import React, { useEffect, useState, useContext } from 'react'
import UserPlaylists from './UserPlaylists'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'
import AuthContext from '../shared/auth-context'

const Playlist = () => {
    const [loadedPlaylists, setLoadedPlaylists] = useState([])
    const { isLoading, sendRequest } = useHttpClient()
    const auth = useContext(AuthContext);
    const userId = auth.userId
  
  useEffect(() => {
    // Fetch users playlists from db
    const fetchPlaylists = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/playlists/user/${userId}`
        );
        
        setLoadedPlaylists(responseData.playlists);
        
      } catch (err) {}      
    };
    fetchPlaylists();
  }, [sendRequest, userId]);

  // Delete playlist
  const playlistDeletedHandler = deletedPlaylistId => {
    setLoadedPlaylists(prevPlaylists =>
      prevPlaylists.filter(playlist => playlist.id !== deletedPlaylistId) 
    );
  };

  return (
    <React.Fragment>
      {isLoading && (<LoadingSpinner asOverlay/>)}
     
      {!isLoading && loadedPlaylists && <UserPlaylists items={loadedPlaylists} onDelete={playlistDeletedHandler}/> }
    </React.Fragment>
  )
    
}

export default Playlist;