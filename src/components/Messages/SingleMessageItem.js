import React, { useState } from 'react'

// Render chat cards
const SingleMessageItem = props => {
  const [button, setShowButton] = useState(false)

  // Show open button
  const showButton = () => {
   setShowButton(true)
  }
// Hide open button
  const hideButton = () => {
    setShowButton(false)
  }

  return(
    <div className="Card" id={props.id} onMouseOver={showButton} onMouseLeave={hideButton}> 
        <div className="Card-body" >
          <h4>Chat with</h4>
          <p>{props.userInfo[0].sendToUser.username}</p>
         
          {button && <button className="Playlist-btn active" 
            onClick={() => {
              localStorage.setItem("matchUserID", JSON.stringify({ userID: props.userInfo[0].sendToUser.id }))
              window.location = `messages/${props.chatID}/${props.userInfo[0].sendToUser.username}`}
          }>Open</button>}
        </div>
      </div>
  )

    
  
}

export default SingleMessageItem;
