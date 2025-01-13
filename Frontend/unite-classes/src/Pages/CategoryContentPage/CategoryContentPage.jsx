import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryContentPage = () => {
  const { classId, subjectName, categoryType } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!classId || !subjectName || !categoryType) {
        setError("Invalid class, subject, or category details.");
        setLoading(false);
        return;
      }

      const apiUrl = `http://localhost:5000/api/classes/${classId}/subjects/${subjectName}/categories/${categoryType}`;
      console.log("Requesting URL:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }

        const data = await response.json();
        setFiles(data.files || []);
      } catch (err) {
        console.error("Error fetching files:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [classId, subjectName, categoryType]);

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Files in {categoryType}</h1>
      <div className="file-container">
        {files.length === 0 ? (
          <p>No files available for this category.</p>
        ) : (
          files.map((file) => (
            <div key={file.fileName} className="file-card">
              <h2>{file.fileName}</h2>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                Download
              </a>
              <p>Uploaded At: {new Date(file.uploadedAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
      <a href={`/classes/${classId}/subjects/${subjectName}/categories`}>Back to Categories</a>
    </div>
  );
};

export default CategoryContentPage;
