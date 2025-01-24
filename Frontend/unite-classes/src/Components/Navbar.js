import React from "react";
import logo from "./nav-logo.png";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import './Navbar.css';  // Importing the external CSS file

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" className="navbar-logo" /> Unite Classes
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                <FaHome className="nav-icon" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/About">
                <FaInfoCircle className="nav-icon" /> About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
