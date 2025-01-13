// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

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

  useEffect(() => {
    if (isLoggedIn) {
      fetchFiles();
    }
  }, [isLoggedIn]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/files', {
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
      const response = await fetch('http://localhost:5000/api/admin/login', {
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
  
    if (!uploadData.file || uploadData.file.size > 5 * 1024 * 1024) {
      setError('File is required and must be smaller than 5MB');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('className', uploadData.className.trim());
    formData.append('subject', uploadData.subject.trim());
    formData.append('category', uploadData.category.trim());
  
    try {
      const response = await fetch('http://localhost:5000/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setSuccess(`File uploaded successfully! URL: ${data.fileUrl}`);
        fetchFiles();
        setUploadData({
          file: null,
          className: '',
          subject: '',
          category: ''
        });
      } else {
        if (response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('adminToken');
          setIsLoggedIn(false);
        } else {
          setError('Upload failed');
        }
      }
    } catch (error) {
      setError('Upload failed. Please try again.');
    }
  };
  
  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        setSuccess('File deleted successfully');
        fetchFiles();
      } else {
        setError('Delete failed');
      }
    } catch (error) {
      setError('Delete failed');
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
              <input
                type="text"
                placeholder="Class Name (e.g., Class 6)"
                className="w-full p-2 border rounded"
                value={uploadData.className}
                onChange={(e) => setUploadData({...uploadData, className: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Subject (e.g., Mathematics)"
                className="w-full p-2 border rounded"
                value={uploadData.subject}
                onChange={(e) => setUploadData({...uploadData, subject: e.target.value})}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Category (e.g., Notes)"
                className="w-full p-2 border rounded"
                value={uploadData.category}
                onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                required
              />
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
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="px-6 py-4 border-b">{file.fileName}</td>
                    <td className="px-6 py-4 border-b">{file.className}</td>
                    <td className="px-6 py-4 border-b">{file.subject}</td>
                    <td className="px-6 py-4 border-b">{file.category}</td>
                    <td className="px-6 py-4 border-b">
                      <input
                        type="text"
                        value={file.fileUrl}
                        readOnly
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4 border-b">
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
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