import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../shared/auth-context'
import './Logout.css'

const Logout = props => {
    const auth = useContext(AuthContext)

    return(
        <Link to="/">
        <li onClick={auth.logout} className="nav-item-back"><i className="fas fa-sign-out-alt"></i>Logout</li>
        </Link>
    )
}

export default Logout