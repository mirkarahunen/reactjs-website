import React from 'react'
import './SingleListItem.css';

// Render playlist information
const SingleListItem = props => {
    return(
      <div className="Card">
        <img variant="top" alt="Playlist" src={require('./img/album.jpg')} />
          <div className="Card-body">
            <h4>{props.name}</h4>
            <button className="Playlist-btn" onClick={() => window.location = 'http://localhost:3000/auth'}>Check out the list</button>
          </div>
        </div>
    )
  
}

export default SingleListItem;
