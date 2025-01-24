import React from "react";
import "./Carousel.css";

const Carousel = () => {
  return (
    <div>
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/carousel1.png"
              className="d-block w-100"
              alt="Slide 1"
            />
            <div className="carousel-caption">
              <h3>Empowering Education</h3>
              <p>Learn, Grow, and Succeed with Unite Classes</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/carousel2.png" className="d-block w-100" alt="Slide 2" />
            <div className="carousel-caption">
              <h3>Interactive Learning</h3>
              <p>Discover the joy of learning with engaging content</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/carousel3.png" className="d-block w-100" alt="Slide 3" />
            <div className="carousel-caption">
              <h3>Achieve Excellence</h3>
              <p>Build your future with the best resources</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/carousel4.png" className="d-block w-100" alt="Slide 3" />
            <div className="carousel-caption">
              <h3>Achieve Excellence</h3>
              <p>Build your future with the best resources</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;