import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isLoggedIn = !!user; // Check if user is authenticated

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-brand">PPP</div>
        <div
          className="toggle-button"
          onClick={() =>
            document.getElementById("nav-links").classList.toggle("active")
          }
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul className="nav-links" id="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tutorial">Tutorial</Link>
          </li>
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to={`/profile/${user.id}`}>Profile</Link>
              </li>
              <li>
                <Link to="#" onClick={handleLogout} className="nav-button">
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
