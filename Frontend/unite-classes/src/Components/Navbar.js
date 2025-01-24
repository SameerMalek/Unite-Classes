import React from "react";
import logo from "./nav-logo.png";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle } from "react-icons/fa";

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
      <style>{`
        /* General Navbar Styles */
        .navbar {
          background-color: #ff6c00;
          padding: 10px 20px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }

        .navbar-brand {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
        }

        .navbar-brand:hover {
          color: #ffe0a1;
        }

        /* Logo Styling */
        .navbar-logo {
          height: 40px;
          width: auto;
          margin-right: 10px;
          transition: transform 0.3s ease;
        }

        .navbar-logo:hover {
          transform: scale(1.1);
        }

        /* Navbar Links */
        .nav-link {
          color: white;
          font-size: 18px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          transition: background-color 0.3s, color 0.3s;
        }

        .nav-link:hover {
          background-color: #e5940c;
          border-radius: 5px;
        }

        .nav-link.active {
          color: #ffe0a1;
        }

        /* Navbar Toggler Icon */
        .navbar-toggler {
          border: none;
        }

        .navbar-toggler-icon {
          width: 24px;
          height: 3px;
          background-color: white;
          display: block;
          position: relative;
        }

        .navbar-toggler-icon::before,
        .navbar-toggler-icon::after {
          content: '';
          width: 24px;
          height: 3px;
          background-color: white;
          position: absolute;
          left: 0;
          transition: transform 0.3s ease;
        }

        .navbar-toggler-icon::before {
          top: -8px;
        }

        .navbar-toggler-icon::after {
          top: 8px;
        }

        /* Mobile View */
        @media (max-width: 768px) {
          .navbar {
            padding: 10px;
          }

          .navbar-brand {
            font-size: 1.5rem;
          }

          .nav-link {
            font-size: 16px;
          }

          .navbar-logo {
            height: 35px;
          }
        }

        /* Desktop Enhancements */
        @media (min-width: 769px) {
          .nav-link {
            padding: 8px 20px;
          }
        }

      `}</style>
    </>
  );
};

export default Navbar;
