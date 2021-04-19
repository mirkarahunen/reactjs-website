import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);

  }
// Handle playlist name
  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  render() {

    return(
      <div className="Playlist" >
        <input defaultValue={'My Beats Playlist'} onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
      {/* ----- Save playlist to db and to spotify ----- */}
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
      </div>
    )
  }
}

export default Playlist;
