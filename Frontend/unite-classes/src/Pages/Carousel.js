import React from "react";
import './Carousel.css'; // Your custom styles, if any

const Carousel = () => {
  return (
    <div>
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/carousel1.png" // Images must be in the public folder
              className="d-block w-100"
              alt="Slide 1"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/carousel2.png"
              className="d-block w-100"
              alt="Slide 2"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/carousel3.png"
              className="d-block w-100"
              alt="Slide 3"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/carousel4.png"
              className="d-block w-100"
              alt="Slide 4"
            />
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
