/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import "./Admin.css";
import { Client, Storage, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('679491bd003711281808'); // Your Appwrite project ID

// Initialize Appwrite Storage service
const storage = new Storage(client);

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [files, setFiles] = useState([]);
  const [uploadData, setUploadData] = useState({
    file: null,
    className: '',
    subject: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});

  // Predefined options for dropdowns
  const classOptions = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const subjectOptions = ['Science', 'Maths', 'English', 'Social Science'];
  const categoryOptions = ['Notes', 'Tests', 'NCERT-Solutions', 'Question-Papers','IMP Questions'];

  useEffect(() => {
    if (isLoggedIn) {
      fetchFiles();
    }
  }, [isLoggedIn]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('https://unite-classes.onrender.com/api/admin/files', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      setError('Failed to fetch files');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://unite-classes.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        setError('');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!uploadData.file || uploadData.file.size > 10 * 1024 * 1024) {
      setError("File is required and must be smaller than 10MB");
      return;
    }
  
    try {
      // Appwrite file upload
      const uploadedFile = await storage.createFile(
        '67949270002d1f2edc95', 
        ID.unique(), 
        uploadData.file
      );
  
      // Create FormData
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('className', uploadData.className);
      formData.append('subject', uploadData.subject);
      formData.append('category', uploadData.category);
  
      const response = await fetch("https://unite-classes.onrender.com/api/admin/upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}`,
          // Remove Content-Type header to let browser set with boundary
        },
        body: formData
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        setSuccess(`File uploaded successfully! URL: ${responseData.fileUrl}`);
        fetchFiles();
        setUploadData({
          file: null,
          className: "",
          subject: "",
          category: "",
        });
      } else {
        console.error("Upload failed:", responseData);
        setError(`Upload failed: ${responseData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("File upload error:", error);
      setError("Upload failed. Please try again.");
    }
  };
  const handleEdit = (file) => {
    setEditMode(file.id);
    setEditData({
      className: file.className,
      subject: file.subject,
      category: file.category
    });
  };

  const handleUpdate = async (fileId) => {
    try {
      const response = await fetch(`https://unite-classes.onrender.com/api/admin/files/${fileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setSuccess('File updated successfully');
        fetchFiles();
        setEditMode(null);
      } else {
        setError('Update failed');
      }
    } catch (error) {
      setError('Update failed');
    }
  };
  
  const handleDelete = async (fileId, className, subject, category) => {
    console.log("Delete Request Initiated:", { fileId, className, subject, category });
  
    if (!window.confirm("Are you sure you want to delete this file?")) return;
  
    try {
      const response = await fetch(
        `https://unite-classes.onrender.com/api/admin/files/${fileId}?className=${encodeURIComponent(className)}&subject=${encodeURIComponent(subject)}&category=${encodeURIComponent(category)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess("File deleted successfully");
        fetchFiles(); // Refresh the file list
      } else {
        console.error("Server response:", data);
        setError(`Delete failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setError("An error occurred while deleting the file. Please check the console for details.");
    }
  };
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Upload File</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <select
                className="w-full p-2 border rounded"
                value={uploadData.className}
                onChange={(e) => setUploadData({...uploadData, className: e.target.value})}
                required
              >
                <option value="">Select Class</option>
                {classOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full p-2 border rounded"
                value={uploadData.subject}
                onChange={(e) => setUploadData({...uploadData, subject: e.target.value})}
                required
              >
                <option value="">Select Subject</option>
                {subjectOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full p-2 border rounded"
                value={uploadData.category}
                onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="file"
                className="w-full p-2 border rounded"
                onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-black p-2 rounded hover:bg-blue-600"
            >
              Upload
            </button>
          </form>
          {success && <p className="text-green-500 mt-4">{success}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Manage Files</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b">File Name</th>
                  <th className="px-6 py-3 border-b">Class</th>
                  <th className="px-6 py-3 border-b">Subject</th>
                  <th className="px-6 py-3 border-b">Category</th>
                  <th className="px-6 py-3 border-b">URL</th>
                  <th className="px-6 py-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className='text-red'>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="px-6 py-4 border-b">{file.fileName}</td>
                    <td className="px-6 py-4 border-b">
                      {editMode === file.id ? (
                        <select
                          className="w-full p-1 border rounded"
                          value={editData.className}
                          onChange={(e) => setEditData({...editData, className: e.target.value})}
                        >
                          {classOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        file.className
                      )}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {editMode === file.id ? (
                        <select
                          className="w-full p-1 border rounded"
                          value={editData.subject}
                          onChange={(e) => setEditData({...editData, subject: e.target.value})}
                        >
                          {subjectOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        file.subject
                      )}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {editMode === file.id ? (
                        <select
                          className="w-full p-1 border rounded"
                          value={editData.category}
                          onChange={(e) => setEditData({...editData, category: e.target.value})}
                        >
                          {categoryOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        file.category
                      )}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <input
                        type="text"
                        value={file.fileUrl}
                        readOnly
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4 border-b space-x-2">
                      {editMode === file.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(file.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditMode(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(file)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
        onClick={() => handleDelete(file.id, file.className, file.subject, file.category)} // Pass className, subject, and category here
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;