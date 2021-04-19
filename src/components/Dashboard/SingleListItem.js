import React from 'react'
import '../Lists/SingleListItem.css';

// Show playlist card
const SingleListItem = props => {
    return(
      <div className="Card" onClick={() => window.location = `/playlists/${props.id}`}>
          <div className="Card-body">
            <h4>{props.name}</h4>
            <p>By: {props.creator}</p>
          </div>
        </div>
    )
  
}

export default SingleListItem;
