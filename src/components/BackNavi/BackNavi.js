import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { MenuItemsBack } from './MenuItemsBack'
import { MenuItemsBackAdmin } from './MenuItemsBackAdmin'
import Logout from '../Logout/Logout'
import AuthContext from '../shared/auth-context'
import './BackNavi.css'


const BackNavigation = () => {
  const auth = useContext(AuthContext)
  const role = auth.role
  const [ clicked, setClicked ] = useState(false)

  const handleClick = () => {
    setClicked(!clicked)
  }

  return (
    <div className={clicked ? "Back-navigation" : "Back-navigation active"}>
      <div className="MenuIconBack" onClick={handleClick}>
        <i className={clicked ? "fas fa-bars" : "fas fa-times"}></i>        
      </div>
        <ul className="Nav-back">
  {/* --------- If user role is Admin, show more (admin) links in the navigation ---------- */}
          {role === "Admin" ? 
          MenuItemsBackAdmin.map((item) => {
            return(
              <Link to={item.to} key={item.id}>
                <li className={item.className}>
                  <i className={item.i.className}/> {item.title}
                </li>
              </Link>
            )})
          :
          MenuItemsBack.map((item) => {
            /* --------- If user role is user, show only user links in the navigation -------- */
            return(
              <Link to={item.to} key={item.id}>
                <li className={item.className}>
                    <i className={item.i.className}/> {item.title}
                  </li>
                </Link>
              )})}
            <Logout />
        </ul>
      </div>
  )
}

export default BackNavigation;
