import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navigation from '../Navi/Navigation'
import MainContent from '../MainContent/MainContent'
import About from '../About/About'
import Lists from '../Lists/Lists'
import Footer from '../Footer/Footer'

import Auth from '../Auth/Auth'

import BackNavi from '../BackNavi/BackNavi'
import Dashboard from '../Dashboard/Dashboard'
import Profile from '../Profile/Profile'
import UpdateUser from '../Profile/UpdateUser'
import Playlists from '../MyPlaylists/Playlists'
import CreatePlaylist from '../CreatePlaylist/CreatePlaylist'
import Users from '../Users/Users'
import Update from '../Users/Update'
import UsersPlaylists from '../UsersPlaylists/UsersPlaylists'
import Comments from '../Comments/Comments'
import UsersComments from '../UsersComments/UsersComments'
import UpdateComment from '../UsersComments/UpdateComment'
import ActivateAccount from '../Auth/ActivateAccount/ActivateAccount'
import Messages from '../Messages/Messages'
import Chat from '../Messages/Chat'
import Logout from '../Logout/Logout'

import NotFound from '../shared/NotFound/NotFound'
import AuthContext from '../shared/auth-context';
import useAuth from '../shared/auth-hook';


const App = () => {
  const { token, login, logout, userId, role } = useAuth();
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
  
  if (token && role === "User") {
    routes = (
      <div className="Main-back">
        <div className="Content">
          <BackNavi />
          <Switch>
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/update/:uid" exact component={UpdateUser} />
            <Route path="/playlists" exact component={UsersPlaylists} />
            <Route path="/playlists/:id" exact component={Comments} />
            <Route path="/my-playlists" exact component={Playlists} />
            <Route path="/create-playlists" exact component={CreatePlaylist} /> 
            <Route path="/messages" exact component={Messages} />
            <Route path="/messages/:chatID/:username" exact component={Chat} />
            <Route path="/log-out" exact component={Logout} />
            <Route component={NotFound} /> 
          </Switch>
        </div>
      </div>
    )
    
  } else if (token && role === "Admin") {
    routes = (
      <div className="Main-back">
        <div className="Content">
          <BackNavi />
          <Switch>
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/update/:uid" exact component={UpdateUser} />
            <Route path="/playlists" exact component={UsersPlaylists} />
            <Route path="/playlists/:id" exact component={Comments} />
            <Route path="/my-playlists" exact component={Playlists} />
            <Route path="/create-playlists" exact component={CreatePlaylist} /> 
            <Route path="/users" exact component={Users} />
            <Route path="/update/user/:uid" exact component={Update} />
            <Route path="/comments" exact component={UsersComments} />
            <Route path="/update/comment/:id" exact component={UpdateComment} />
            <Route path="/messages" exact component={Messages} />
            <Route path="/messages/:chatID/:username" exact component={Chat} />
            <Route path="/log-out" exact component={Logout} />
            <Route component={NotFound} />  
          </Switch>
        </div>
      </div>
    )
  } else {
    routes = (
      <div className="Main">
        <Navigation className={navigation ? "Navigation Sticky" : "Navigation"} onScroll={handleSticky}/>
          <Switch>
            <Route path="/" exact component={MainContent}/>
            <Route path="/about" exact component={About} />
            <Route path="/lists" exact component={Lists} />
            <Route path="/auth" exact component={Auth} />
            <Route path="/account_activation/:id" exact component={ActivateAccount} />
            <Route component={NotFound} />    
          </Switch>
          <Footer/>
          
      </div>
    )
  }

return (  
    <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          role: role,
          userId: userId,
          login: login,
          logout: logout
        }}
        >
    
      <Router>
        <main>{routes}</main>
      </Router>
      
    </AuthContext.Provider>  
  )
}

export default App;
