import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UploadVideoForm from '../components/UploadVideoForm';
import VideoCard from '../components/VideoCard';
import Spinner from '../components/Spinner';
import axios from '../api/axios';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [receivedVideos, setReceivedVideos] = useState([]);
  const [viewingVideoBlobUrl, setViewingVideoBlobUrl] = useState(null);
  const [viewingVideoTitle, setViewingVideoTitle] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUploadedVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/videos/my');
      setUploadedVideos(res.data);
    } catch (error) {
      console.error('Error fetching uploaded videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceivedVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/videos');
      setReceivedVideos(res.data);
    } catch (error) {
      console.error('Error fetching received videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my') fetchUploadedVideos();
    if (activeTab === 'received') fetchReceivedVideos();
  }, [activeTab]);

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

    const closeViewer = () => {
    if (viewingVideoBlobUrl) {
      window.URL.revokeObjectURL(viewingVideoBlobUrl);
      setViewingVideoBlobUrl(null);
      setViewingVideoTitle(null);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'received' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('received')}
          >
            Videos
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'my' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('my')}
          >
            My Videos
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Video
          </button>
        </div>
        {activeTab === 'upload' && <UploadVideoForm />}
        {activeTab === 'my' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <Spinner />
            ) : (uploadedVideos.length === 0 ? (<p>No videos found.</p>) :
              (uploadedVideos.map((video) => (
                <VideoCard key={video.id} video={video} onView={handleView} onDownload={handleDownload} />)
              ))
        )}
        </div>
        )}
        {activeTab === 'received' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <Spinner />
            ) : (
              receivedVideos.length === 0 ? (<p>No videos found.</p>) :
              (receivedVideos.map((video) => (
                <VideoCard key={video.id} video={video} onView={handleView} onDownload={handleDownload} />)
              ))
            )}
          </div>
        )}
      </div>
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
};

export default UserDashboard;