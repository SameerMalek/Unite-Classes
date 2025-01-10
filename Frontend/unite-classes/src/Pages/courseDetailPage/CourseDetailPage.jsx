import React from 'react';
import { useParams, Link } from 'react-router-dom';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const contentTypes = [
    { id: 'notes', name: "Notes" },
    { id: 'tests', name: "Tests" },
    { id: 'materials', name: "Materials" },
    { id: 'chapters', name: "Chapters" },
  ];

  return (
    <div>
      <h1>{courseId.charAt(0).toUpperCase() + courseId.slice(1)}</h1>
      <div className="card-container">
        {contentTypes.map((content) => (
          <Link key={content.id} to={`/upload/${content.id}`} className="card">
            <h2>{content.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseDetailPage;