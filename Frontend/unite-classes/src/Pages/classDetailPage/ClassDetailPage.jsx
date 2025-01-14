import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import "./ClassDetailPage.css";
import '../homePage/Pages.css'


const ClassDetailPage = () => {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classes/${classId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }
        const data = await response.json();
        if (data && data.subjects) {
          setSubjects(data.subjects);
        } else {
          setError("No subjects found for this class.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSubjects();
  }, [classId]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Subjects</h1>
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
          ))
        }
      </div>
    </div>
  );
};

export default ClassDetailPage;
