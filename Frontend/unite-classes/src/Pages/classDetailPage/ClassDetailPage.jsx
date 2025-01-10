import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ClassDetailPage = () => {
  const { classId } = useParams();
  const courses = [
    { id: 'science', name: "Science" },
    { id: 'maths', name: "Maths" },
  ];

  return (
    <div>
      <h1>Class {classId}</h1>
      <div className="card-container">
        {courses.map((course) => (
          <Link key={course.id} to={`/course/${course.id}`} className="card">
            <h2>{course.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClassDetailPage;