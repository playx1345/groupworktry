import React, { useState } from 'react';

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return alert('Select a CSV file first!');
    setLoading(true);
    setProgress('Uploading...');
    setErrors([]);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('csvfile', file);

    try {
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
        setErrors([data.error || 'Unknown error']);
      }
    } catch (err) {
      setProgress('Upload failed.');
      setErrors([err.message]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Bulk Result Upload (CSV)</h2>
      <p>Format: <code>name,email,matricNumber,level,score</code></p>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} disabled={loading} />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
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