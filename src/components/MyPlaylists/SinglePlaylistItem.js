import React, { useContext, useState } from 'react'
import './SinglePlaylistItem.css'
import AuthContext from '../shared/auth-context';
import { useHttpClient } from '../shared/http-hook'


const SinglePlaylistItem = props => {
    const [button, setShowButton] = useState(false)
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext)

// Delete playlist from the db
const deleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/playlists/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  }

  // Show delete button
  const showButton = () => {
    setShowButton(true)
   }
   // Hide delete button
   const hideButton = () => {
     setShowButton(false)
   }


    return(
        <React.Fragment>
            <div className="Card" onMouseOver={showButton} onMouseLeave={hideButton}>
                <img variant="top" alt="Playlist" src={require('./img/album.jpg')} />
                <div className="Card-body">
                    <h4>{props.name}</h4>
                    <>{props.playlistTracks}</>
                    {button && <button className="Playlist-btn active" onClick={deleteHandler}>Delete</button>}
                </div>
            </div>
            
        </React.Fragment>
    )
}

export default SinglePlaylistItem