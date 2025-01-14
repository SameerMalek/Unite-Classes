import React from 'react';
import "./Card.css";

const Card = ({ title, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h2>{title}</h2>
    </div>
  );
};

export default Card;
