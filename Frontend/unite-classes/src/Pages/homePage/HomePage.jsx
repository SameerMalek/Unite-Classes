// HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../Carousel';
import '../homePage/Pages.css';

const HomePage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('https://unite-classes.onrender.com/api/classes');
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
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="home-page">
        <Carousel />
      <header className="header">
        <h1>Welcome to Unite Classes</h1>
      </header>
      <main className="main-content">
      
        <section className="welcome-section">
          <h2>Your Path to Success Begins Here</h2>
          <p>Explore our range of classes designed to help you excel academically and beyond.</p>
        </section>
        <section className="card-container">
          {classes.map((cls) => (
            <Link
              key={cls._id}
              to={`/class/${cls._id}`}
              className="card"
            >
              <div
                className="card-image"
                style={{ backgroundImage: `url(${cls.backgroundImage})` }}
              ></div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
