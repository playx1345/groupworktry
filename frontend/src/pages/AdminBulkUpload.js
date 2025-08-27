import React, { useState } from 'react';

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState('');
  const [errors, setErrors] = useState([]);

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return alert('Select a CSV file first!');
    setProgress('Uploading...');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('csvfile', file);

    const res = await fetch('/api/bulkresult/csv-upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setProgress('Upload complete!');
      setErrors(data.errors || []);
    } else {
      setProgress('Upload failed.');
      setErrors([data.error]);
    }
  };

  return (
    <div>
      <h2>Bulk Result Upload (CSV)</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{progress}</p>
      {errors.length > 0 && (
        <div>
          <h3>Errors:</h3>
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err.key ? `${err.key}: ${err.error}` : err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}