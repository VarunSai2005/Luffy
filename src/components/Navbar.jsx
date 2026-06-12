import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">Joyboy has returned<span></span></div>

      <ul className="nav-links">
        {/* <li>Drums of Liberation</li> */}
        <li>Meat & Adventure</li>
        <li>Free the Oppressed</li>
        <li>King of the Pirates</li>
      </ul>
    </nav>
  )
}

export default Navbar