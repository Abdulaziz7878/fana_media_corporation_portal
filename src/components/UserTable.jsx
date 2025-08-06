import { useEffect, useState } from "react";
import axios from "../api/axios";
import Spinner from "./Spinner";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [passwords, setPasswords] = useState({});
  const currentUser = JSON.parse(localStorage.getItem("fmc_user")); // should have id and role

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (userId) => {
    const isAdminChangingSelf = userId === currentUser.user.id;

    const payload = isAdminChangingSelf
      ? {
          currentPassword: passwords[userId]?.currentPassword || "",
          newPassword: passwords[userId]?.newPassword || "",
        }
      : {
          newPassword: passwords[userId]?.newPassword || "",
        };

    const endpoint = isAdminChangingSelf
      ? `/users/change-password`
      : `/users/${userId}/change-password`;

    try {
      await axios.put(endpoint, payload);
      alert("Password changed successfully.");
      setEditingId(null);
      setPasswords((prev) => ({ ...prev, [userId]: {} }));
    } catch (err) {
      console.error("Failed to change password", err);
      alert(err.response?.data?.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mt-6 p-4 rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">User Management</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center border-t">
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2 space-x-2">
                {editingId === user.id ? (
                  <div className="flex gap-2 items-center">
                    {user.id === currentUser.user.id && (
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={passwords[user.id]?.currentPassword || ""}
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            [user.id]: {
                              ...prev[user.id],
                              currentPassword: e.target.value,
                            },
                          }))
                        }
                        className="border p-1 rounded"
                      />
                    )}
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwords[user.id]?.newPassword || ""}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          [user.id]: {
                            ...prev[user.id],
                            newPassword: e.target.value,},
                        }))
                      }
                      className="border p-1 rounded"
                    />
                    <button
                      onClick={() => handlePasswordChange(user.id)}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {currentUser.user.role === "admin" && (
                      <>
                        <button
                          onClick={() => setEditingId(user.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Change Password
                        </button>
                        {user.id !== currentUser.user.id && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;