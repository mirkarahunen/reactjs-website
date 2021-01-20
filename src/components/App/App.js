import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navigation from '../Navi/Navigation'
import MainContent from '../MainContent/MainContent'
import About from '../About/About'
import Lists from '../Lists/Lists'
import Footer from '../Footer/Footer'

import Auth from '../Auth/Auth'


const App = () => {
  const [ navigation, setNavigation ] = useState(false)

  const handleSticky = () => {
      if (window.pageYOffset) {
        setNavigation(true)
      } else {
        setNavigation(false)
      }
  }

  window.addEventListener('scroll', handleSticky)
  
  let routes;
  
    routes = (
      <div className="Main">
        <Navigation className={navigation ? "Navigation Sticky" : "Navigation"} onScroll={handleSticky}/>
          <Switch>
            <Route path="/" exact component={MainContent}/>
            <Route path="/about" exact component={About} />
            <Route path="/lists" exact component={Lists} />
            <Route path="/auth" exact component={Auth} />
          </Switch>
          <Footer/>
      </div>
      
    )
    return (
    <Router>
    <main>{routes}</main>
  </Router>
   )
}

  


export default App;
