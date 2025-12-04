import React, { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'enable' : 'disable';
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      await userApi.updateUserStatus(id, newStatus);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Manage Users</h1>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${
                      user.role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-primary'
                    }`}
                  >
                    {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${user.enabled ? 'bg-success' : 'bg-danger'}`}
                  >
                    {user.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      user.enabled ? 'btn-danger' : 'btn-success'
                    }`}
                    onClick={() => handleToggleStatus(user.id, user.enabled)}
                  >
                    {user.enabled ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;

