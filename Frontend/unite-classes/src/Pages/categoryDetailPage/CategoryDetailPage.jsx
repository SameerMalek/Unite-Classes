import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryDetailPage.css";

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

      const apiUrl = `http://localhost:5000/api/classes/${classId}/subjects/${subjectName}/categories`;
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

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Categories for {subjectName}</h1>
      <div className="card-container">
        {categories.length === 0 ? (
          <p>No categories found for this subject.</p>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="card">
              <h2>
                {/* Link to CategoryContentPage with category ID */}
                <Link to={`/classes/${classId}/subjects/${subjectName}/categories/${category.type}`}>
  {category.type}
</Link>


              </h2>
            </div>
          ))
        )}
      </div>
      {/* Corrected back link to match routes */}
      <Link to={`/classes/${classId}/subjects/${subjectName}`}>Back to Subject</Link>
    </div>
  );
};

export default CategoryDetailPage;
