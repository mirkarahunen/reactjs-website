import React from 'react';
import './ListsItems.css'
import SingleListItem from './SingleListItem'

const ListsItem = props => {

    if (props.items.length === 0) {
        return(
          <div className="Lists">
            <h3>No playlists</h3>
          </div>
        )
    } else {
        return(
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
            
        )
    }
}

export default ListsItem