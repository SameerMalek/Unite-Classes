import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Pages.css'
const CourseDetailPage = () => {
  const { classId, subjectName, categoryType } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `https://unite-classes.onrender.com/api/classes/${classId}/subjects/${subjectName}/categories/${categoryType}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched files:", data); // Log the data to check what is returned
        setFiles(data); // Set the files from the response
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFiles();
  }, [classId, subjectName, categoryType]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{categoryType}</h1>
      <div className="file-container">
        {files.length === 0 ? (
          <p>No files available for this category.</p>
        ) : (
          files.map((file) => (
            <div key={file.fileName} className="file-card">
              <h2>{file.fileName}</h2>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                View
              </a>
              <p>Uploaded At: {new Date(file.uploadedAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
