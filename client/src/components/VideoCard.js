import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import timeAgo from './timeAgo';
import { BsThreeDotsVertical } from "react-icons/bs"
import { deleteVideo } from '../redux/videoActions';

import { useDispatch } from 'react-redux';
import { getChannelVideos } from '../redux/channelActions';

const VideoCard = ({ video, showTheChannel = true, isOwner, setCurrVideo, toggleVideoModal}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const toggleModal = (e) => {
    e.stopPropagation(); // Prevents video click from triggering onClick
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  const handleEdit = () => {
    console.log('Editing video:', video._id);
    setIsModalOpen(false); // Close modal after action
    setCurrVideo(video);
    toggleVideoModal()
  };

  const handleDelete = async() => {
    console.log('Deleting video:', video._id);
    await deleteVideo(video._id, video.channelId)
    setIsModalOpen(false); // Close modal after action
    dispatch(getChannelVideos(video.channelId))
  };

  return (
    <div onClick={() => { navigate(`/video/${video._id}`); }} className="mb-4">
      {/* Wrapper for maintaining aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
        />
        {/* Duration Overlay */}
        <div className="absolute flex items-center justify-center bottom-2 right-2 bg-black bg-opacity-70 text-white font-medium text-xs px-[2px] py-[1px] rounded">
          {video.duration ? video.duration : "10:00"}
        </div>
      </div>

      <div className="py-4 flex items-start relative"> {/* Added relative positioning here */}
        {/* Profile Picture */}
        {showTheChannel && <img
          src={video.channelProfilePic} 
          alt={video.channelName}
          className="w-8 h-8 rounded-full mr-2"
        />}
        <div className="flex flex-col w-full">
          <h3 className="font-medium text-white">{video.title}</h3>
          {showTheChannel && <p className="text-[#AAAAAA] text-sm">
            {video.channelName}
          </p>}
          <p className="text-[#AAAAAA] text-sm">
            {video.views} views • uploaded {video?.createdAt ? `${timeAgo(video.createdAt)}` : ''}
          </p>
        </div>

        {/* Three-dot Button */}
        {isOwner && <div 
          className="ml-auto text-white text-xl p-2 cursor-pointer"
          onClick={toggleModal} // Open modal on click
          onMouseEnter={() => setIsHovered(true)} // Set hover state to true
          onMouseLeave={() => setIsHovered(false)} // Set hover state to false
        >
          <BsThreeDotsVertical/>
        </div>}

        {/* Modal (Appears only when 'More Options' is clicked) */}
        {isModalOpen && (
          <div 
            className="absolute top-0 right-0 mt-6  bg-black p-2 rounded-lg shadow-md w-40 text-sm z-10"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal if clicked inside
            onMouseEnter={() => setIsHovered(true)} // Keep modal open if hovering over it
            onMouseLeave={() => {
              setIsHovered(false); // Close modal if not hovering over the button or modal
              setIsModalOpen(false); // Close the modal if not hovered
            }}
          >
            <ul className="">
              <li>
                <button onClick={handleEdit} className="w-full hover:bg-[#383838] text-left p-2 text-white">Edit</button>
              </li>
              <li>
                <button onClick={handleDelete} className="w-full hover:bg-[#383838] text-left p-2 text-white">Delete</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
