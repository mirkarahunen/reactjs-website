import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Pusher from 'pusher-js'
import './Chat.css'

const Chat = () => {
    const [value, setValue] = useState('')
    const [previousMessages, setPreviousMessages] = useState([])
    const [messages, setMessages] = useState([])
    const chatID = useParams().chatID
    const sendToUser = {
        username: useParams().username,
        id: JSON.parse(localStorage.matchUserID).userID
    }
    const currentUser = {
        username: JSON.parse(localStorage.userData).username,
        id: JSON.parse(localStorage.userData).userId
        }

   

    useEffect(() => {
      // Connecting to pusher to be able to send messages
        const connectToPusher = async () => {
            try {
                const pusher = new Pusher('App secret password or key', {
                    authEndpoint: 'http://localhost:5000/messages/pusher/auth',
                    cluster: 'eu',
                    encrypted: true
                });
  
                // Subscribe to the 'private-reactchat' channel
                let chatRoom = pusher.subscribe('beats');
                chatRoom.bind('messages', newmessage => {
                  
                  setMessages(messages.concat(newmessage))
                  
                });
            } catch (error) {}
        }
        connectToPusher()

        // Get chat history from the db
        const retrieveHistory = async () => {
            try {
                const response = await fetch(`http://localhost:5000/messages/${chatID}`)
                const responseData = await response.json()
                
                if(!response.ok) {
                    throw new Error(responseData.message)
                }

                setPreviousMessages(responseData.messages) 
            } catch (error) {} 
          }
     retrieveHistory() 

    }, [messages, chatID])

    
// Handle message value state
    const handleChange = async (event) => {
        setValue(event.target.value);
    }
// Send message to the other user
    const sendMessage = async (event) => {

        event.preventDefault();
        // Start chat with no previous messages
        if (value !== '' && previousMessages.length === 0) {
            await fetch(`http://localhost:5000/messages/${chatID}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                  currentUser: currentUser,
                  sendToUser: sendToUser,
                  message: value,
                  chatID: chatID
                })  
            })
            // set value again back to empty string
            setValue('')
            // Send message to a chat that already exists
        } else if (value !== '' && previousMessages.length > 0){
          await fetch(`http://localhost:5000/messages/${chatID}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                  currentUser: currentUser,
                  sendToUser: sendToUser,
                  message: value
                })  
            })
            // set value again back to empty string
            setValue('')
        }
    }

    // Render old and new posted messages
    return (
      <div className="chat">
        <div className="chat-container">
        {/* --- Change background color depending on the sender --- */}
        {previousMessages.map((item, i) => {
            if (item.currentUser.id === currentUser.id) {
              
                return (
                    <div key={i} className="message-box-me">
                      <p>{item.message}</p>
                    </div>                  
                  )
            } else {
                return (
                    <div key={i} className="message-box">
                      <p>{item.message}</p>
                    </div>                  
                  )
            }
        })}
        {/* --- Send message --- */}
          <div className="chat-msg-container">
            <form onSubmit={sendMessage}>
              <div>
                <input
                  type="text"
                  className=""
                  value={value}
                  placeholder="Enter your message here"
                  onChange={handleChange}
                 />
              </div>
              <div>
                <input className="message-btn" value="Send" type="submit" />
              </div>
             </form>
          </div>
        </div>
      </div>
    )
}

export default Chat