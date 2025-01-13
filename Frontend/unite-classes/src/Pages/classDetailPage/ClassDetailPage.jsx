import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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

  // Render error message if there is an issue fetching the data
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Subjects</h1>
      <div className="card-container">
        {/* Show a message if no subjects are found */}
        {subjects.length === 0 ? (
          <p>No subjects found for this class.</p>
        ) : (
          subjects.map((subject) => (
            <div key={subject._id} className="card">
              <Link to={`/classes/${classId}/subjects/${subject.name}/categories`}>
                <h2>{subject.name}</h2>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassDetailPage;
