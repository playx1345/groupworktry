import React, { useEffect, useState } from 'react';

export default function AdminStudentTable() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/admin/students', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(setStudents);
  }, [token]);

  const handleBulkDelete = async () => {
    for (const id of selected) {
      await fetch(`/api/admin/student/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setStudents(students.filter(s => !selected.includes(s._id)));
    setSelected([]);
  };

  return (
    <div>
      <h2>Student List</h2>
      <button disabled={selected.length === 0} onClick={handleBulkDelete}>
        Delete Selected
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
          {students.map(s => (
            <tr key={s._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(s._id)}
                  onChange={e =>
                    setSelected(selected =>
                      e.target.checked
                        ? [...selected, s._id]
                        : selected.filter(id => id !== s._id)
                    )
                  }
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
    </div>
  );
}