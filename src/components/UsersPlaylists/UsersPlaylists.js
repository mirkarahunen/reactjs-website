import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'

import ListsItems from './ListsItems'
import './UsersPlaylists.css'

const UsersPlaylists = () => {
    const [loadedPlaylists, setLoadedPlaylists] = useState()
    const { isLoading, sendRequest } = useHttpClient()
    
    useEffect(() => {
        // Fetch all playlists from db
        const fetchPlaylists = async () => {
            try {
                const response = await sendRequest(`http://localhost:5000/playlists`)

                setLoadedPlaylists(response.playlists) 
            } catch (error) {}
            
        }
        fetchPlaylists()

    }, [sendRequest])

    return(
        <React.Fragment>
            {isLoading && (<LoadingSpinner asOverlay/>)}
            {loadedPlaylists && <ListsItems items={loadedPlaylists} />}
            
        </React.Fragment>
        
    )
}

export default UsersPlaylists