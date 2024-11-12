import React from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video, showTheChannel = true }) => {

  const navigate = useNavigate();
  return (
    <div onClick={()=>{navigate(`/video/${video._id}`)}} className="mb-4" >
      {/* Wrapper for maintaining aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
        />
        {/* Duration Overlay */}
        <div className="absolute flex items-center justify-center bottom-2 right-2 bg-black bg-opacity-70 text-white font-medium text-xs px-[2px] py-[1px] rounded">
          {video.duration ? video.duration : "10:00"} {/* Assuming `duration` is a property in video object */}
        </div>
      </div>
      <div className="py-4 flex items-start">
        {/* Profile Picture */}
        {showTheChannel&& <img
          src={video.channelProfilePic} // Assuming this is the property for the profile picture
          alt={video.channelName}
          className="w-8 h-8 rounded-full mr-2"
        />}
        <div className='flex flex-col'>
          <h3 className="font-medium text-white">{video.title}</h3>
          {showTheChannel && <p className="text-[#AAAAAA] text-sm">
            {video.channelName}{/* This text can be dynamically updated based on the video's upload time */}
          </p>}
          <p className="text-[#AAAAAA] text-sm">
            {video.views} views • uploaded ago {/* This text can be dynamically updated based on the video's upload time */}
          </p>
        </div>
        
      </div>

    </div>
  );
};

export default VideoCard;
