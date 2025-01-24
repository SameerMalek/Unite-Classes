import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../homePage/Pages.css";

const CategoryDetailPage = () => {
  const { classId, subjectName } = useParams();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!classId || !subjectName) {
        setError("Invalid class or subject details.");
        setLoading(false);
        return;
      }

      const apiUrl = `https://unite-classes.onrender.com/api/classes/${classId}/subjects/${subjectName}/categories`;
      console.log("Requesting URL:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [classId, subjectName]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Categories for {subjectName}</h1>
      <div className="card-container">
        {categories.length === 0 ? (
          <p>No categories found for this subject.</p>
        ) : (
          categories.map((category) => (
            <Link
              className="card card-image"
              key={category._id}
              to={`/classes/${classId}/subjects/${subjectName}/categories/${category.type}`}
              style={{
                backgroundImage: `url(${
                  category.backgroundImage || "https://via.placeholder.com/300"
                })`,
              }}
            ></Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
