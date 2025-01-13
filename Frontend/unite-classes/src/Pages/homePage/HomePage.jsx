import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classes');
        if (!response.ok) {
          throw new Error(`Failed to load classes: ${response.statusText}`);
        }
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <div>Loading classes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome to Unite Classes</h1>
      <div className="card-container">
        {classes.map((cls) => (
        <Link key={cls._id} to={`/class/${cls._id}`} className="card"> 
        <h2>{cls.className}</h2> 
      </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;