import React from 'react'
import './SingleListItem.css';

const SingleListItem = props => {
    return(
      <div className="Card">
          <div className="Card-body">
            <h4>{props.name}</h4>
            <button className="Playlist-btn" onClick={() => window.location = 'http://localhost:3000/auth'}>Check out the list</button>
          </div>
        </div>
    )
  
}

export default SingleListItem;
