import React from 'react';

import './ListsItems.css'
import SingleListItem from './SingleListItem'

// Render all playlists from all users
const ListsItem = props => {
  
    if (props.items.length === 0) {
        return(
          <div className="Lists">
            <div className="Lists-header">
              <h3>No playlists</h3>
            </div>
          </div>
        )
    } else {
        return(
        <div className="Lists">
          <div className="Lists-header">
              <h3>Playlists from users</h3>
            </div>
          <div className="Lists-cards">    
            {props.items.map((item, i) => {
            return(
            <SingleListItem 
              key={i}
              id={item.id}
              name={item.name}
              playlistTracks={Object.values(item)[0].map((track, i) => 
                <p key={i}><b> {track.artist}: </b> {track.name}</p> 
              )}
              creator={item.creator}
            />
          )})}
                  
          </div>
        </div>    
        )
    }
}

export default ListsItem