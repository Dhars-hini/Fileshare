import React, { useState, useEffect } from 'react';
import './FileShare.css';

export default function FileShare() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    fetch('http://localhost:5000/files')
      .then(response => response.json())
      .then(data => {
        setFiles(data);
      })
      .catch(error => {
        console.error('Error fetching files:', error);
      });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('http://localhost:5000/files', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('File uploaded successfully:', data);
      setSelectedFile(null);
      fetchFiles();
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  };

  const handleFileDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/files/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      console.log('File deleted successfully');
      fetchFiles();
    })
    .catch(error => {
      console.error('Error deleting file:', error);
    });
  };

  const handleFileDownload = (id, filename) => {
    window.open(`http://localhost:5000/files/download/${id}`, '_blank');
  };

  const handleShare = (id, filename) => {
    // Implement your share functionality here
    alert(`Share ${filename}`);
  };

  return (
    <div className="file-share-container">
      <h1>File Share</h1>
      <br />
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button onClick={handleFileUpload}>Upload</button>
      <br />
      <br />
      {files.map(file => (
        <div key={file.id} className="file-item">
          <div>
            <h4>{file.originalname}</h4>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
            {/* Add file type icons based on file type */}
            {/* Example: */}
            {/* {file.type === 'application/pdf' && <img src="pdf-icon.jpg" alt="PDF" />} */}
            {/* {file.type === 'image/jpeg' && <img src="jpeg-icon.jpg" alt="JPEG" />} */}
          </div>
          <div className="file-actions">
            <button onClick={() => handleFileDownload(file.id, file.filename)}>Download</button>
            <button onClick={() => handleFileDelete(file.id)}>Delete</button>
            <button onClick={() => handleShare(file.id, file.filename)}>Share</button>
          </div>
        </div>
      ))}
    </div>
  );
}
