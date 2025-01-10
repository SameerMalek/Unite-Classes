import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const classes = [
    { id: 6, name: "Class 6" },
    { id: 7, name: "Class 7" },
    { id: 8, name: "Class 8" },
  ];

  return (
    <div>
      <h1>Welcome to Tuition Classes</h1>
      <div className="card-container">
        {classes.map((cls) => (
          <Link key={cls.id} to={`/class/${cls.id}`} className="card">
            <h2>{cls.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;