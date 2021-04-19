import React from 'react';
import './About.css';

class About extends React.Component {
  render() {
    return(
      /* --------- HEADER -------- */
      <div>
      <div className="about">
        <h2>About us</h2>
      </div>

      <div className="about-text">
        <p>We are the new modern technology-driven company.
          Our greatest passion is connecting people with music.
        </p>
      </div>

      {/* --------- MIDDLE BOXES -------- */}
      <div className="info-boxes">

      <div className="playlist-box">
      <img src={require('./img/playlist.jpg')} alt="Playlist"/>
      <h4>Create Playlists</h4>
        <p>You will find everything starting from the old classics to the newest Beats and it gives
          you the change to create your createst playlist and to share it with others users.</p>
      </div>

      <div className="spotify-box">
      <img src={require('./img/spotify.jpg')} alt="Connect with Spotify"/>
      <h4>Save Lists to Spotify Account</h4>
        <p>Now you also have the change to save your newest creation on Beats to your own Spotify account
        and share it with your followers. Like this you can concentrate on listening over Spotify and
        create your playlists over Beats.</p>
      </div>

      </div>

      </div>
    )
  }
}

export default About;
