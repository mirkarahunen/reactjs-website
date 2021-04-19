import React from "react";
import { Link } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import './Navigation.css';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
// Set initial values
    this.state = {
      clicked: false,
      className: 'btn create',
      sticky: false,
    }

    this.handleClick = this.handleClick.bind(this);
  }
// Handle icon change in the navigation (if open or not)
  handleClick() {
    this.setState({ clicked: !this.state.clicked })
  }


  render() {
    
  return(
    
    <div className={this.props.className} id="Nav">
      <div className="Logo">
        <img src={require('./img/logo/beats-logo.png')} alt="logo"/>
      </div>

      <div className="MenuIcon" onClick={this.handleClick}>
        <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>

      <div className="Header-links">
        <ul className={this.state.clicked ? "nav active" : "nav"}>
          {/* --- Render menu items in navigation --- */}
          {MenuItems.map((item) => {
            return(
              <Link to={item.to} key={item.id}>
              <li className={item.className}>
                {item.title}
              </li>
              </Link>
              )})}

              
            </ul>
        </div>
      </div>
    )
  }
}

export default Navigation;
