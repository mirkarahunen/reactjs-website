import React from 'react';
import './UserPlaylists.css';
import SinglePlaylistItem from './SinglePlaylistItem'

// Render all current users playlists
const UserPlaylists = props => {
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
          <h2>My Playlists</h2>
        </div>
        <div className="Lists-cards">
          
        {props.items.map((item, i) => {
          return(
          <SinglePlaylistItem 
            key={i}
            id={item.id}
            name={item.name}
            playlistTracks={Object.values(item)[0].map((track, i) => 
              <p key={i}><b> {track.artist}: </b> {track.name}</p> 
              )}
            creator={item.creator}
            onDelete={props.onDelete}
             />
            )})}
            
        </div>
      </div>
    )
  }
}

export default UserPlaylists;
