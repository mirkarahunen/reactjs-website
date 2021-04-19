import React, { useEffect, useState, useContext } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'
import AuthContext from '../shared/auth-context'
import MessageItem from './MessageItem'

const Messages = () => {
    const auth = useContext(AuthContext)
    const userId = auth.userId
    const [loadedMessages, setLoadedMessages] = useState([])
    const { isLoading, sendRequest } = useHttpClient()
    const [user, setUser] = useState([])
    
    useEffect(() => {
        // Fetch user information from db
        const fetchUser = async () => {
            try {
                const userResponse = await sendRequest(`http://localhost:5000/users/${userId}`)
                setUser(userResponse.user)
                // Fetch chat information from db
                const chatsResponse = await sendRequest(`http://localhost:5000/messages/user/${userId}`)
                setLoadedMessages(chatsResponse.chats) 
            } catch (error) {}
            
        }
        fetchUser()

    }, [sendRequest, userId])

    return(
        <React.Fragment>

            {isLoading && (<LoadingSpinner asOverlay/>)}
            {!isLoading && <MessageItem items={loadedMessages} user={user}/>}
            
        </React.Fragment>
        
    )
}

export default Messages