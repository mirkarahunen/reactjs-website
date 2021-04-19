import React from 'react';
import './CreatePlaylist.css';
import SearchBar from './SearchBar/SearchBar';
import Playlist from './Playlist/Playlist';
import SearchResults from './SearchResults/SearchResults';

import SpotifySearch from '../../util/SpotifySearch/SpotifySearch';
import SpotifySave from '../../util/SpotifySave/SpotifySave';

let access_token = window.location.search.slice(1).split('=')[1]
class CreatePlaylist extends React.Component {
  constructor(props) {
    super(props);
    // Set initial values
    this.state = {
      searchResults: [],
      playlistName: 'My Beats playlist',
      playlistTracks: [],
      success: '',
      className: 'success',
      updated: false,
      accessToken: access_token
    };

    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  addTrack(track) {
    // Check if track has already been added
    if(this.state.playlistTracks.find(savedTrack =>
      savedTrack.id === track.id)) {
        return;
      }
    // Add track and set new state to playlist tracks 
      this.state.playlistTracks.push(track);
      this.setState({playlistTracks: this.state.playlistTracks});
    }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    // Filter out track to be removed with its id
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    // Set new state to the playlist tracks
    this.setState({playlistTracks: tracks});
  }

  // Handle playlist name
  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  // Save playlist to spotify and then set values back to initial values
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    SpotifySave.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: '',
        playlistTracks: [] 
      });
    });

    // Post playlist into the db
    const userId = JSON.parse(localStorage.userData).userId
    const username = JSON.parse(localStorage.userData).username

    try {
      fetch('http://localhost:5000/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer ' + userId 
        },
        body: JSON.stringify({
          name: this.state.playlistName,
          playlistTracks: this.state.playlistTracks,
          creatorId: userId,
          creator: username
        })
      });
      this.setState({ 
        success: 'Playlist was saved successfully!', 
        updated: !this.state.updated
    })
    
    } catch (err) {
      console.log(err)
    }
  }
// Connect search function with the spotify api to be able to search from the app
  search(word) {
    SpotifySearch.search(word).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  render() {
    return(  
      <div className="Lists">
        {!this.state.accessToken ?
        <>
        <div className="Lists-header">
          <h3>Start with signing into Spotify</h3>  
        </div>         
          <div className="Playlist-Container">
            <button className="Spotify-Login-Button" onClick={() => window.location  = 'http://localhost:5000/login'}>Sign in to Spotify</button>
          </div>
        </>
        :
        <>
        <div className="logged-in">
        <div className="Playlist-Container">
          <h3>Create your own playlist with Spotify</h3>
          <h4 className={this.state.updated ? "success active" : "success"} >{this.state.success}</h4>
        </div>
      
          <SearchBar onSearch={this.search} />
          </div>    
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
         
              <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
                    onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}
                    onSave={this.savePlaylist} /> 
          </div> 
          </>
          }
        
        
      </div>
    )
  }
}

export default CreatePlaylist;
