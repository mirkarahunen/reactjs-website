import React, { useEffect, useState } from 'react'
import './Lists.css'
import ListsItems from './ListsItems'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'


const Lists = () => {
    const [loadedPlaylists, setLoadedPlaylists] = useState()
    const { isLoading } = useHttpClient()
  
    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response = await fetch('http://localhost:8080/playlists')

                const responseData = await response.json()
                
                if(!response.ok) {
                    throw new Error(responseData.message)
                }
                setLoadedPlaylists(responseData.playlists) 
            } catch (error) {}
            
        }
        sendRequest()
    }, [])


  return (
      <div className="Lists">
        {isLoading && <LoadingSpinner asOverlay />} 
        <div className="Lists-header">
          <h2>Playlists from users</h2>
          <p>Check out some of the playlists of our users and get inspired!</p>
        </div>
        {isLoading && (<LoadingSpinner asOverlay/>)}
          {!isLoading && loadedPlaylists && (
        <ListsItems items={loadedPlaylists} /> 
      )}
    </div>
  )
    
}

export default Lists;