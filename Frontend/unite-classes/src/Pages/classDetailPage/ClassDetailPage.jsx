import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import '../homePage/Pages.css';

const ClassDetailPage = () => {
  const { classId } = useParams(); // Get the classId from the URL
  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState(""); // State to hold the class name
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classes/${classId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }
        const data = await response.json();
        if (data) {
          setClassName(data.className || `Class ${classId}`); // Use className from the API, fallback to classId
          setSubjects(data.subjects || []); // Populate subjects or set empty array
        } else {
          setError("No class data found.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClassDetails();
  }, [classId]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Subjects for {className}</h1>
      <div className="card-container">
        {subjects.map((subject) => (
          <Link
            key={subject.name}
            to={`/classes/${classId}/subjects/${subject.name}/categories`}
            className="card"
            style={{
              backgroundImage: `url(${subject.backgroundImage || "https://via.placeholder.com/300"})`,
            }}
          >
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClassDetailPage;
