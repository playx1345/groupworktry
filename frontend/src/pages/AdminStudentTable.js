import React, { useEffect, useState } from 'react';

const STUDENTS_PER_PAGE = 20;

export default function AdminStudentTable() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/admin/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStudents(data);
        else setError(data.error || 'Failed to fetch students');
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchStudents();
  }, [token]);

  const paginatedStudents = students.slice((page - 1) * STUDENTS_PER_PAGE, page * STUDENTS_PER_PAGE);
  const maxPage = Math.ceil(students.length / STUDENTS_PER_PAGE);

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Delete ${selected.length} students? This cannot be undone.`)) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/students/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selected }),
      });
      if (res.ok) {
        setStudents(students.filter(s => !selected.includes(s._id)));
        setSelected([]);
      } else {
        const data = await res.json();
        setError(data.error || 'Bulk delete failed.');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelected(selected =>
      selected.includes(id)
        ? selected.filter(sid => sid !== id)
        : [...selected, id]
    );
  };

  return (
    <div>
      <h2>Student List</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button disabled={selected.length === 0 || loading} onClick={handleBulkDelete}>
        {loading ? 'Deleting...' : `Delete Selected (${selected.length})`}
      </button>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Matric Number</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map(s => (
            <tr key={s._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(s._id)}
                  onChange={() => toggleSelect(s._id)}
                  disabled={loading}
                />
              </td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.matricNumber}</td>
              <td>{s.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} of {maxPage} </span>
        <button disabled={page === maxPage || maxPage === 0} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}