import { useEffect, useState } from "react";
import axios from "../api/axios";
import Spinner from "./Spinner";

export default function VideoTable() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingVideoBlobUrl, setViewingVideoBlobUrl] = useState(null);
  const [viewingVideoTitle, setViewingVideoTitle] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/videos/all");
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
      alert("Failed to fetch videos.");
    } finally {
      setLoading(false);
    }
  };


    const handleDownload = async (video) => {
    try {
    const response = await axios.get(`/videos/download/${video.id}`, {
      responseType: 'blob', // important for handling binary data
    });
    // Get the filename from response headers
    const disposition = response.headers['content-disposition'];
    let filename = `${video.title}.mp4`;

    if (disposition && disposition.includes('filename=')) {
      const filenameMatch = disposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Create a URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);

    // Try to extract error message from response if available
    if (error.response && error.response.data) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          alert(`Error: ${reader.result}`);
        };
        reader.readAsText(error.response.data);
      } catch {
        alert('Download failed. Please try again.');
      }
    } else {
      alert(`Error: ${error.message}`);
    }
  }
}

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await axios.delete(`/videos/${id}`);
      setVideos((prev) => prev.filter((video) => video.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete video.");
    }
  };

  const handleView = async (video) => {
    try {
      // Clean up previously viewed video blob URL if any
      if (viewingVideoBlobUrl) {
        window.URL.revokeObjectURL(viewingVideoBlobUrl);
        setViewingVideoBlobUrl(null);
        setViewingVideoTitle(null);
      }

      const response = await axios.get(`/videos/download/${video.id}`, {
        responseType: "blob",
      });

      // Create a blob URL for video playback
      const blobUrl = window.URL.createObjectURL(response.data);
      setViewingVideoBlobUrl(blobUrl);
      setViewingVideoTitle(video.title);
    } catch (err) {
      console.error("Failed to load video for viewing:", err);
      alert("Failed to load video for viewing.");
    }
  };

  // Close video viewer: release blob URL and clear state
  const closeViewer = () => {
    if (viewingVideoBlobUrl) {
      window.URL.revokeObjectURL(viewingVideoBlobUrl);
      setViewingVideoBlobUrl(null);
      setViewingVideoTitle(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="overflow-x-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">All Uploaded Videos</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Sender</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="text-center">
              <td className="border px-4 py-2">{video.title}</td>
              <td className="border px-4 py-2">{video.description}</td>
              <td className="border px-4 py-2">{video.category}</td>
              <td className="border px-4 py-2">{video.uploaded_by}</td>
              <td className="border px-4 py-2">{new Date(video.upload_date).toLocaleString()}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                onClick={() => handleView(video)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleDownload(video)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {videos.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                No videos found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Video viewer modal */}
       {viewingVideoBlobUrl && (
        <div 
             className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 p-4" 
             onClick={closeViewer} 
             style={{ cursor: "pointer" }} 
             >
                 <div onClick={(e) => e.stopPropagation()} // prevent modal close on video click 
                 className="bg-white p-4 rounded max-w-3xl w-full" 
                 >
                     <div 
                     className="flex justify-between items-center mb-4"
                     >
                         <h3 
                         className="text-lg font-semibold"
                         >
                            {viewingVideoTitle}
                            </h3>
                            <button onClick={closeViewer} 
                            className="px-4 py-2 bg-red-600 text-white rounded" 
                            type="button" 
                            >
                                Close
                            </button>
                        </div>
                        <video
                        className="w-full max-h-[75vh] object-contain"
                        width="100%"
                        controls 
                        controlsList="nodownload" 
                        src={viewingVideoBlobUrl} 
                        preload="metadata"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
}