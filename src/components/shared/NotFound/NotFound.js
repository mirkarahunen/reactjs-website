import React from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../../shared/auth-hook';
import './NotFound.css'

const NotFound = () => {
    const { token } = useAuth();
   
  if (token) {
        return(
        <div className="not-found-container">
            <h1>404 - Page not Found!</h1>
        </div>
    )
  } else {
    return(
        <div className="not-found-container">
            <h1 className="not-found-heading">404 - Page not Found!</h1>
            <i className="fas fa-arrow-right"></i>
            <Link to="/">
            Click here to go back to homepage
            </Link>
        </div>
    )
  }
}

export default NotFound