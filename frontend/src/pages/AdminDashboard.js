import React from 'react';
import AdminBulkUpload from './AdminBulkUpload';
import AdminStudentTable from './AdminStudentTable';

function AdminNav() {
  return (
    <nav>
      <ul>
        <li><a href="/admin/add-student">Add Student</a></li>
        <li><a href="/admin/announcement">Send Announcement</a></li>
      </ul>
    </nav>
  );
}

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminNav />
      <AdminBulkUpload />
      <AdminStudentTable />
    </div>
  );
}