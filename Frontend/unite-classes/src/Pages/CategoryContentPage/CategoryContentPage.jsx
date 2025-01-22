import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../homePage/Pages.css";

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

      const apiUrl = `https://unite-classes.onrender.com/api/classes/${classId}/subjects/${subjectName}/categories/${categoryType}/files`;
      console.log("Requesting URL:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Received data:", data); // Debug log
        
        if (data.files && Array.isArray(data.files)) {
          setFiles(data.files);
        } else {
          console.error("Invalid data format received:", data);
          setError("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching files:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [classId, subjectName, categoryType]);

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="category-content-page">
      <h1>
        Files in {categoryType} - {subjectName}
      </h1>
      {files.length === 0 ? (
        <div className="no-files-message">
          <p>No files available for this category.</p>
        </div>
      ) : (
        <div className="files-container">
          <table className="file-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>File Name</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={file.fileName || index}>
                  <td>{index + 1}</td>
                  <td>{file.fileName}</td>
                  <td>
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="view-button"
                      onClick={() => window.open(file.fileUrl, "_blank")}
                    >
                      View
                    </button>
                    <button
                      className="download-button"
                      onClick={() => handleDownload(file.fileUrl, file.fileName)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryContentPage;
