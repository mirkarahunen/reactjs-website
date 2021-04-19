import React, { useState } from 'react'
import './SingleListItem.css';

const SingleListItem = props => {
  const [button, setShowButton] = useState(false)
  //console.log(props)

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
        <img variant="top" alt="Playlist" src={require('./img/album.jpg')} />
          <div className="Card-body" >
            <h4>{props.name}</h4>
            <p>By: {props.creator}</p>
            {button && <button className="Playlist-btn active" onClick={() => window.location = `playlists/${props.id}`}>Open</button>}
          </div>
        </div>
    )
  
}

export default SingleListItem;
