import React from 'react';
import './Footer.css';

class Footer extends React.Component {
  render() {
    return(
      <div className="Footer">
        <div className="Contact">
        <h4> Contact </h4>
          <p><span><i className="far fa-envelope"></i></span>info@beats.com</p>
          <p className="Last">All rights reserved. Privacy Policy and Terms of Service</p>
        </div>
        <div className="SM-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
        </div>
      </div>
    )
  }
}

export default Footer;
