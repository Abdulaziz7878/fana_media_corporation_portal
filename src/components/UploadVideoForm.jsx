import { useEffect, useState } from "react";
import axios from "../api/axios";
import Spinner from "./Spinner";

export default function UploadVideoForm({ isAdmin }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "entertainment",
    recipient_id: "", // for Admin
    video: null,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isAdmin) {
      axios.get("/users").then((res) => {
        setUsers(res.data);
      });
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.video) return alert("Please choose a video file.");

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("category", form.category);
    if (isAdmin && form.recipient_id !== "all") {
      data.append("recipient_id", form.recipient_id);
    }
    data.append("video", form.video);

    try {
        setLoading(true);
      await axios.post("/videos/upload", data);
      setSuccessMsg("Video uploaded successfully!");
      setForm({
        title: "",
        description: "",
        category: "entertainment",
        recipient_id: "",
        video: null,
      });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">Upload Video</h2>

      {loading && <Spinner />}
      {successMsg && (
        <div className="mb-4 text-green-600 font-medium">{successMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full border px-4 py-2 rounded"
          required
        ></textarea>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="entertainment">Entertainment</option>
          <option value="news">News</option>
          <option value="documentary">Documentary</option>
        </select>

        {isAdmin && (
          <select
            name="recipient_id"
            value={form.recipient_id}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="all">Send to All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        )}

        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleChange}
          className="w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}