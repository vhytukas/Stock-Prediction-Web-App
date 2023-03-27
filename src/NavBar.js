import React from 'react'

const NavBar = ({readMe, home}) => {
  return (
    <div className="navbar bg-base-300 min-h-[8.5%]">
    <div className="flex-1">
    <a className="btn btn-ghost normal-case text-xl" onClick={home}>Stock Prediction App</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1 text-xl">
      <li onClick={readMe}><a className="btn btn-ghost normal-case text-xl">Read me!</a></li>
    </ul>
  </div>
</div>
  )
}

export default NavBar