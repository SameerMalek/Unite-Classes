import React from "react";
import logo from "./nav-logo.png";
import { Link } from 'react-router-dom';

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
          <ul className="navbar-nav ms-auto"> {/* ms-auto for right alignment */}
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
      {
        <style>{`
        /* General Navbar Styles */
.navbar {
  background-color: #333333;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px; /* Add padding for better spacing */
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: 600;
  color: #FFAE13;
  display: flex;
  align-items: center;
  padding: 0; /* Remove extra padding around brand */
}
.navbar-brand:focus, .navbar-brand:hover {
   color: #FFAE13;
}
/* Navbar Logo Styling */
.navbar-logo {
  height: 70px; /* Set the height of the logo */
  width: auto;  /* Maintain aspect ratio of the logo */
  margin-right: 10px; /* Space between the logo and the navbar brand text */
  transition: transform 0.3s ease; /* Smooth scaling effect when hovered */
}

.navbar-brand:hover .navbar-logo {
  transform: scale(1.1); 
  color: #FFAE13; /* Slightly enlarge the logo when hovering over the brand */
}

/* Navbar Links Styling */
.nav-link {
  color: gray;     
 font-size: 20px;
  font-weight: 500; /* Lighten the weight of the font for readability */
  transition: color 0.3s ease, background-color 0.3s ease;
  padding: 8px 15px; /* Add padding for better clickability */
}                        

/* Navbar */
.navbar {
  background-color: #333333;  /* Dark background */
  color: #FFAE13;             /* Front color for text */
}

.navbar a {
  color: #FFAE13;             /* Text color for links */
  text-decoration: none;
  padding: 10px 15px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.navbar a:hover {
  color: #FF5733;             /* Hover color */
}


/* Active Link Styling */
.nav-link.active {
  color: #ffeb3b;
}

/* Button Styling */
.btn-light {
  background-color: #ffffff;
  color: #28a745;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-light:hover {
  background-color: #28a745;
  color: #fff;
}

.btn-danger {
  background-color: #f44336;
  color: #fff;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-danger:hover {
  background-color: #d32f2f;
  color: #fff;
}

/* Navbar Toggler Icon */
.navbar-toggler-icon {
  background-color: #fff;
}

/* Mobile and Tablet View */
@media (max-width: 768px) {
  /* Collapse navbar items into a vertical stack on mobile */
  .navbar-collapse {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* Adjust navbar links to be center-aligned */
  .nav-link {
    font-size: 1.25rem;
    text-align: center;
    padding: 10px 0;
    width: 100%;
  }

  .nav-link:hover {
    background-color: rgba(0, 0, 0, 0.1); /* Hover effect */
  }

  /* Make navbar brand text a little smaller */
  .navbar-brand {
    font-size: 1.5rem; /* Adjust brand size for smaller screens */
  }

  /* Reduce logo size on mobile */
  .navbar-logo {
    height: 50px; /* Make the logo smaller on mobile */
  }

  /* Toggler button size */
  .navbar-toggler {
    border: none; /* Remove default border */
  }
}

/* Tablet View (For better readability) */
@media (max-width: 1024px) {
  .navbar-nav .nav-link {
    font-size: 1.15rem; /* Slightly reduce font size on tablets */
  }
}

      `}</style>
      }
    </>
  );
};

export default Navbar;
