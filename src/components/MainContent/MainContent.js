import React from 'react';
//import LogoAnimation from './LogoAnimation/LogoAnimation';
import './MainContent.css';

class MainContent extends React.Component {
  constructor(props) {
    super(props);
    // Set initial values
    this.state = {
      users: {
        length: null,
        image1: '',
        image2: '',
        image3: '',
      },
      playlists: null,
      activeSlide: {
        slide: 0,
        className: ''
      }
      
    }

    this.showNextSlide = this.showNextSlide.bind(this)
    this.showPrevSlide = this.showPrevSlide.bind(this)
  }

 componentDidMount() {
   // Fetch users information from the db
      try {
        fetch('http://localhost:5000/users', {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          // Set user images for the slideshow
          this.setState({users:
            { 
            image1: data.users[0].image,
            image2: data.users[1].image, 
            image3: data.users[2].image, 
            length: data.users.length 
          }})
        })
    } catch (error) {}

    // Fetch playlist information from db
    try {
      fetch('http://localhost:5000/playlists', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        this.setState({playlists: data.playlists.length})
      })
  } catch (error) {}   

  setInterval(this.showNextSlide, 6000)
}

showNextSlide() {
  let slideshowImages = document.querySelectorAll('.Main-content .Customer-comments-section .Comment')
  
    this.setState({
      activeSlide: {
      slide: this.state.activeSlide.slide === slideshowImages.length - 1 ? 0 : this.state.activeSlide.slide + 1
      }
    }) 
}  

showPrevSlide() {
  let slideshowImages = document.querySelectorAll('.Main-content .Customer-comments-section .Comment')

  this.setState({
    activeSlide: {
    slide: this.state.activeSlide.slide === 0 ? slideshowImages.length - 1 : this.state.activeSlide.slide - 1
    }
  })
}
  render() {

    

    return(
      <div className="Main-content">
        <div className="content">
          <h1>Beats</h1>
          <h3>The new home for music lovers</h3>
          <div className="button-bg">
            <button onClick={() => window.location = '/auth'}>Start here</button>
          </div>
        </div>
          <div className="About-us">
            <h2>Who we are</h2>
              <p>We are the new modern technology-driven company.
                Our greatest passions are music and getting to know ne people with the help of music.</p>
              <p className="second-line">Don't get bored with you old playlists. Get inspired with the help of our users instead!</p>
          </div>

          <div className="Middle-section">
            <h3>Everyday new users</h3>
            <h3 className="Second">Join the community and sign up!</h3>
            <button onClick={() => window.location = '/auth'}>Click here to join</button>
          </div>

          <div className="Company-information">
            <div className="Section-one">
              <i className="fas fa-star-of-life"></i>
              <h3 className="Data">2020</h3>
              <p>Live for users since</p>
            </div>
            <div className="Section-two">
              <i className="fas fa-smile"></i>
              <h3 className="Data">{this.state.users.length}</h3>
              <p>Number of happy users</p>
            </div>
            <div className="Section-three">
              <i className="fas fa-headphones"></i>
              <h3 className="Data">{this.state.playlists}</h3>
              <p>Number of playlists created</p>
            </div>
           
          </div>

          <div className="Customer-comments-section">
          
          
            <div className={this.state.activeSlide.slide === 0 ? "Comment active" : "Comment"}>
              <img alt="User" src={`http://localhost:5000/`+ this.state.users.image1}/>
              <p>"Beats is one of the most easy-using platforms I know. Ever since the first time I fell in love with it.
                I'm definitely recommending to friends and family!"</p>
            </div>
            <div className={this.state.activeSlide.slide === 1 ? "Comment active" : "Comment"}>
              <img alt="User" src={`http://localhost:5000/`+ this.state.users.image2}/>
              <p>"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
                Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, 
                pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."</p>
            </div>
            <div className={this.state.activeSlide.slide === 2 ? "Comment active" : "Comment"}>
              <img alt="User" src={`http://localhost:5000/`+ this.state.users.image3}/>
              <p>"The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc, 
                Europe uses the same vocabulary. The languages only differ in their grammar, their pronunciation and their most common words."</p>
            </div>
            <button onClick={this.showPrevSlide} className="PrevBtn"><i className="fas fa-chevron-left"></i></button>
          <button onClick={this.showNextSlide} className="NextBtn"><i className="fas fa-chevron-right"></i></button>
          </div>
      </div>
    )
  }
}

export default MainContent;
