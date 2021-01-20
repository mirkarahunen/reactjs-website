import React from 'react';
import './About.css';

class About extends React.Component {
  render() {
    return(
      <div>
      <div className="about">
        <h2>About us</h2>
      </div>

      <div className="about-text">
        <p>We are the new modern technology-driven company.
          Our greatest passion is connecting people with music.
        </p>
      </div>

      <div className="info-boxes">

      <div className="playlist-box">
      <img src={require('./img/playlist.jpg')} alt="Playlist"/>
      <h4>Create Playlists</h4>
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
      </div>

      <div className="spotify-box">
      <img src={require('./img/spotify.jpg')} alt="Connect with Spotify"/>
      <h4>Save Lists to Spotify Account</h4>
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
      </div>

      </div>

      </div>
    )
  }
}

export default About;
