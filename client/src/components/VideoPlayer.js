import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { MdFullscreen } from "react-icons/md";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdVolumeOff } from "react-icons/md";
import { IoMdVolumeHigh } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleVideo } from '../redux/videoActions';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const videoToPlay = useSelector((state) => state.videos.videoToPlay);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false); // New state for hover controls
  const playerRef = useRef(null);
  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const toggleDescription = () => {
    console.log("button clicked")
    setDescriptionExpanded(!descriptionExpanded);
  };

  useEffect(() => {
    const fetchVideo = async () => {
      await dispatch(fetchSingleVideo(videoId));
    };
    fetchVideo();
  }, [dispatch, videoId]);

  const handleProgress = (progress) => {
    if (!isDragging) {
      setCurrentTime(progress.playedSeconds);
    }
  };

  const handleDuration = (duration) => setDuration(duration);
  const togglePlaying = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleFullscreen = () => {
    if (playerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerRef.current.wrapper.requestFullscreen();
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateScrubberPosition(e);
  };

  const updateScrubberPosition = (e) => {
    if (timelineRef.current && duration) {
      const timelineWidth = timelineRef.current.offsetWidth;
      const dragPositionX = e.clientX - timelineRef.current.getBoundingClientRect().left;
      const newTime = Math.max(0, Math.min((dragPositionX / timelineWidth) * duration, duration));
      setDragTime(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      playerRef.current.seekTo(dragTime);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        requestAnimationFrame(() => updateScrubberPosition(e));
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragTime]);

  return (
    <div className="flex flex-col min-h-screen h-auto items-left rounded bg-black p-4">
      <div 
        className="w-full max-w-3xl rounded-lg overflow-hidden relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {videoToPlay ? (
          <div>
            <ReactPlayer
              ref={playerRef}
              url={videoToPlay.videoUrl}
              playing={playing}
              width="100%"
              height="auto"
              volume={volume}
              muted={muted}
              onProgress={handleProgress}
              onDuration={handleDuration}
            />
            {/* Video player bar */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-20 p-3 px-4 flex flex-col items-center justify-between transition-transform duration-300 ease-in-out ${
                showControls ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <div
                className="relative w-full mx-4 h-1 mb-2 bg-gray-300 bg-opacity-30 cursor-pointer"
                ref={timelineRef}
                onMouseDown={handleMouseDown}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-red-600"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="absolute top-0.5 h-3 w-3 rounded-full bg-red-600 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex flex-row w-full">
                <button onClick={togglePlaying} className="text-white text-2xl">
                  {playing ? <IoMdPause /> : <IoMdPlay />}
                </button>
                <div className="relative flex mr-auto mx-8 items-center group">
                  <button onClick={toggleMute} className="text-white text-2xl">
                    {muted || volume === 0 ? <MdVolumeOff /> : <IoMdVolumeHigh />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute ml-8 opacity-0 group-hover:opacity-100 w-0 group-hover:w-16 h-0.5 bg-white appearance-none transition-all duration-300 ease-in-out"
                  />
                </div>
                <button onClick={handleFullscreen} className="text-white text-4xl">
                  <MdFullscreen />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white">Loading...</p>
        )}
      </div>
      <div className="flex flex-col mt-3 w-full max-w-3xl p-0 rounded-lg">
        <h3 className="text-white text-xl font-semibold">{videoToPlay?.title || "Loading..."}</h3>
        <div className='flex flex-row items-center mt-2'>
            <img
            src={"https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"} // Assuming this is the property for the profile picture
            alt={videoToPlay?.channelName}
            className="w-10 h-10 rounded-full mr-2 "
            />
            <h1 className='text-white font-semibold'>{videoToPlay?.channelName}</h1>

            <button className='text-black text-sm font-medium  bg-white rounded-full px-4 py-2 mr-auto ml-4'>
                Subscribe
            </button>

            <div className='flex flex-row items-center justify-center text-sm text-white font-medium mx-2'>
                <button className='bg-white bg-opacity-20 py-2 px-4 rounded-l-full'>
                    Like
                </button>
                <div className='py-4 bg-transparent'>
                    <div className=' bg-black w-[0.5px]'></div>
                </div>
                
                <button className='bg-white bg-opacity-20 py-2 px-4 rounded-r-full'>
                    Dislike
                </button>
            </div>

            <button className='bg-white mx-2 text-white text-sm bg-opacity-20 py-2 px-4 rounded-full'>
                Share
            </button>
        </div>

        <div className="mt-4 w-full max-w-3xl p-4 rounded-lg text-white bg-white bg-opacity-10">
            <div className="flex justify-between text-sm font-bold  mb-2">
                <span>{videoToPlay?.views} views</span>
                <span>{videoToPlay?.channelName} ago</span>
            </div>
            <p className="text-sm font-bold">
                {descriptionExpanded ? videoToPlay?.description : `${videoToPlay?.description.slice(0, 120)}...`}
            </p>
            <button onClick={toggleDescription} className="text-sm font-semibold cursor-pointer mt-2">
                {descriptionExpanded ? "Show less" : "Show more"}
            </button>
            </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
