import React, { useState } from 'react';
import axios from '../api/axios';
import Spinner from './Spinner';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/users', formData);
      setSuccessMsg("User created successfully!");
      setFormData({ username: '', password: '', role: 'user' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Create New User</h2>

      <div>
        <label className="block text-sm">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error ? <p className="text-red-500 text-sm">{error}</p> : <p className="text-green-500 text-sm">{successMsg}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};

export default CreateUserForm;