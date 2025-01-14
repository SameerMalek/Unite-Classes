import React from 'react';
import { Link } from 'react-router-dom';
import "./header.css";  

const Header = () => {
  return (
    <header className="header">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
