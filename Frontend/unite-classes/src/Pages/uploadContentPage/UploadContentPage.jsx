import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const UploadContentPage = () => {
  const { courseId } = useParams();
  const [content, setContent] = useState("");

  const handleUpload = () => {
    console.log(`Uploading ${content} for ${courseId}`);
    // TODO: Add API call to upload content
  };

  return (
    <div>
      <h1>Upload Content for {courseId}</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter content here..."
      ></textarea>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadContentPage;
