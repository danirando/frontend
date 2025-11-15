// src/layouts/DefaultLayout.jsx
import { NavLink, Outlet } from "react-router-dom";


export default function DefaultLayout() {
  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="nav-item">
          🏠 Home
        </NavLink>

        <NavLink to="/search" className="nav-item">
          🔍 Cerca
        </NavLink>

        <NavLink to="/watchlist" className="nav-item">
          ⭐ Watchlist
        </NavLink>
      </nav>

       <div className="app-background">
        <Outlet />
      </div>
    </>
  );
}
