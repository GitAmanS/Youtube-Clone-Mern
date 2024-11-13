import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadVideo, editVideo} from '../redux/videoActions';
import { useDispatch, useSelector } from 'react-redux';
import { getChannelVideos } from '../redux/channelActions';

const VideoModal = ({ showVideoModal, toggleVideoModal, video = null, channelId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const channel = useSelector((state) => state.auth.mychannel);
  const dispatch = useDispatch();

  useEffect(() => {
    if (video && video._id) {
      setTitle(video?.title || '');
      setDescription(video?.description || '');
    } else {
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
    }
  }, [video]);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('channelId', channelId);
    formData.append('video', videoFile);
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile)
      console.log("we did add the thumbnail file")
    };

    try {
      if (video && video._id) {
        formData.append('videoId', video._id)
        await editVideo(formData);
        toggleVideoModal()
        dispatch(getChannelVideos(channelId))
      } else {
        await uploadVideo(formData);
        toggleVideoModal()
        dispatch(getChannelVideos(channelId))
      }
      toggleVideoModal();
    } catch (error) {
      console.log('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={toggleVideoModal}
      className={`fixed inset-0 flex items-center justify-center z-40 bg-gray-500 bg-opacity-50 transition-opacity ${
        showVideoModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="z-50 bg-white p-6 rounded-lg w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // I have prevented event bubling here \
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={toggleVideoModal}>
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">{video && video._id ? 'Edit Video' : 'Upload Video'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          {!video && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Video File</label>
              <input
                type="file"
                onChange={handleVideoChange}
                required={!video}
                className="mt-1 block w-full text-sm text-gray-900 file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
            <input
              type="file"
              onChange={handleThumbnailChange}
              className="mt-1 block w-full text-sm text-gray-900 file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? (video && video._id ? 'Updating...' : 'Uploading...') : (video && video._id ? 'Update' : 'Upload')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoModal;
