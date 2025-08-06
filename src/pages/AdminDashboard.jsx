import { useState } from "react";
import Navbar from "../components/Navbar";
import UploadVideoForm from "../components/UploadVideoForm";
import UserTable from "../components/UserTable";
import VideoTable from "../components/VideoTable";
import CreateUserForm from "../components/CreateUserForm";

export default function AdminDashboard() {
  const [view, setView] = useState("videos");

  return (
    <div>
      <Navbar />
      <div className="flex justify-center gap-4 my-4">
        <button onClick={() => setView("videos")} className={`px-4 py-2 rounded ${
              view === 'videos' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>View All Videos</button>
        <button onClick={() => setView("upload")} className={`px-4 py-2 rounded ${
              view === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>Upload Video</button>
        <button onClick={() => setView("users")} className={`px-4 py-2 rounded ${
              view === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>Manage Users</button>
        <button onClick={() => setView("create")} className={`px-4 py-2 rounded ${
              view === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>Create User</button>
      </div>

      <div className="px-4">
        {view === "videos" && <VideoTable />}
        {view === "upload" && <UploadVideoForm isAdmin={true} />}
        {view === "users" && <UserTable />}
        {view === "create" && <CreateUserForm />}
      </div>
    </div>
  );
}