import React from 'react';
import AdminBulkUpload from './AdminBulkUpload';
import AdminStudentTable from './AdminStudentTable';

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><a href="/admin/add-student">Add Student</a></li>
        <li><a href="/admin/announcement">Send Announcement</a></li>
      </ul>
      <AdminBulkUpload />
      <AdminStudentTable />
    </div>
  );
}