import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import './PlaylistItem.css'
import { useHttpClient } from '../../shared/http-hook'
import AuthContext from '../../shared/auth-context'

const PlaylistItem = props => {
  const playlistId = useParams().id
  const auth = useContext(AuthContext)
  const { sendRequest } = useHttpClient()
  const userId = auth.userId
  //console.log(userId)

  // Submit user likes to the db
  const submitLikes = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(`http://localhost:5000/playlists/${playlistId}`, 
        'POST',
        JSON.stringify({
            likes: userId
        }),
        {
            'Content-Type': 'application/json'
        }
        ); 
      window.location.reload()
        
    } catch (err) {}
    
  }

    return(
        <div className="Card-comments" id={props.id}>
            <div className="Card-body">
              <h4>{props.item.name}</h4>
                {<i className="fas fa-heart" onClick={submitLikes}></i>}
                {/* --- Ingrement users likes --- */}
                {props.item.likes.length === 0 ? 
                  <p> 0 Likes</p>
                  :
                  <p>{props.item.likes.length} Likes</p>
                }
                
                <p> {props.item.playlistTracks.length} Songs</p>
                <table className="playlist-table" >
                  <thead className="playlist-table-head">
                    <tr>
                      <td>Artist</td>
                      <td>Song</td>
                      <td>Album</td>
                    </tr>
                  </thead>
                  <tbody>
                  {props.item.playlistTracks.map((track, i) =>
                    <tr key={i}> 
                      <td >{track.artist}</td>
                      <td >{track.name}</td>
                      <td >{track.album}</td>
                    </tr>
                    )}
                  </tbody>
                </table>
            </div>
            
          </div>
          
      )
}

export default PlaylistItem