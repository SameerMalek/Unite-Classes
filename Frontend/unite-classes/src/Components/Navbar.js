import React from "react";
import logo from "./nav-logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
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
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/About">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <style>{`
        /* General Navbar Styles */
        .navbar {
          background-color: #333333;
          padding: 8px 15px; /* Reduced padding for compact height */
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .navbar-brand {
          font-size: 1.5rem; /* Adjusted font size for better proportions */
          font-weight: 600;
       color : #FFAE13;
          align-items: center;
        }

        .navbar-brand:hover {
          color: #FFAE13;
        }

        /* Logo Styling */
        .navbar-logo {
          height: 50px; /* Reduced logo size for compact height */
          width: auto;
          margin-right: 8px;
          transition: transform 0.3s ease;
        }

        .navbar-brand:hover .navbar-logo {
          transform: scale(1.1);
        }

        /* Navbar Links */
        .nav-link {
          color: gray;
          font-size: 18px; /* Slightly smaller font for compact look */
          font-weight: 500;
          padding: 5px 10px; /* Reduced padding for compact height */
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #FFAE13;
        }

        .nav-link.active {
          color: #FFAE13;
        }
           .nav-link.focus {
          color: #FFAE13;
        }

        /* Navbar Toggler Icon */
        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba(255, 255, 255, 1)' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
        }

        /* Mobile View */
        @media (max-width: 768px) {
          .navbar {
            padding: 6px 10px;
          }

          .navbar-brand {
            font-size: 1.3rem;
          }

          .navbar-logo {
            height: 40px; /* Further reduce logo size on smaller screens */
          }

          .nav-link {
            font-size: 16px;
            padding: 8px 5px;
          }

          .navbar-toggler {
            border: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
