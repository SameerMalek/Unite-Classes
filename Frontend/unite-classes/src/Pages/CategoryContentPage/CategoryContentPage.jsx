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

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="category-content-page">
      <h1>Files in {categoryType}</h1>
      {files.length === 0 ? (
        <p>No files available for this category.</p>
      ) : (
        <table className="file-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>File Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={file.fileName}>
                <td>{index + 1}</td>
                <td>{file.fileName}</td>
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
      )}
    </div>
  );
};

export default CategoryContentPage;