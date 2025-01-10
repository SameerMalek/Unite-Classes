import React from 'react';

const Card = ({ title, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h2>{title}</h2>
    </div>
  );
};

export default Card;
