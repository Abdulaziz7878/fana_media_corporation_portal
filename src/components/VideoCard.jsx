const VideoCard = ({ video, onDownload, onDelete, onView }) => {
  return (
    <div className="shadow rounded p-4 flex justify-between items-center mb-3">
      <div>
        <h3 className="font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-600">{video.description}</p>
        <p className="text-xs text-gray-500">Uploaded: {new Date(video.upload_date).toLocaleString()}</p>
      </div>
      <div className="flex gap-2">
        {onView && (
          <button onClick={() => onView(video)} className="text-blue-600">
            View
          </button>
        )}
        {onDownload && (
          <button onClick={() => onDownload(video)} className="text-green-600">
            Download
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(video)} className="text-red-600">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCard;