// Assuming you're displaying the video player on a separate page or modal
import React from 'react';
import VideoPlayer from './VideoPlayer';
import CommentSection from './CommentSection';

const VideoDetailPage = ({ video }) => {
  return (
    <div className="min-h-screen p-4 ml-16 mt-10">
      <VideoPlayer video={video} />
      {/* <CommentSection/> */}
    </div>
  );
};

export default VideoDetailPage;
