import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getChannel } from '../redux/authActions';
import { getChannelVideos } from '../redux/channelActions';
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import ChannelModal from './ChannelModal';

const ChannelPage = () => {
    const { channelId } = useParams();
    const channel = useSelector((state) => state.auth.mychannel);
    const user = useSelector((state) => state.auth.user);
    const videos = useSelector((state)=> state.channel.channelVideos);
    const [currVideo, setCurrVideo] = useState(null)
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showChannelModal, setShowChannelModal] = useState(false);
  



    const toggleChannelModal = ()=>{
      setShowChannelModal(!showChannelModal)
    }
  

    const toggleVideoModal = ()=>{
        setShowVideoModal(!showVideoModal)
    }

    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("Home");

    useEffect(() => {
      const fetchData = async () => {
          await dispatch(getChannel(channelId));
          await dispatch(getChannelVideos(channelId));

      };
  
      fetchData();
  }, [dispatch, channelId]); 
  

    return (
        <div className='flex flex-col ml-16 min-h-screen h-auto bg-inherit pt-12'>
            {/* Banner Image Section */}
            <div className='w-full h-48 bg-gray-300 rounded-xl'>
                {/* Placeholder for Banner Image */}
                <img src={channel?.bannerImage || 'default-banner.jpg'} alt='Banner' className='w-full h-full rounded-xl object-cover' />
            </div>

            <div className='flex flex-row items-center p-6'>
                {/* Profile Picture */}
                <div className='w-40 h-40 rounded-full overflow-hidden bg-gray-300 mr-4'>
                    <img src={channel?.profilePic || 'default-profile.jpg'} alt='Profile' className='w-full h-full object-cover' />
                </div>

                {/* Channel Details */}
                <div>
                    <h1 className='text-4xl text-white font-bold py-2'>{channel?.name || 'Channel Name'}</h1>
                    <p className='text-[#AAAAAA] text-sm'>
                        <span>{channel?.subscribers || 0} Subscribers</span> · <span>{channel?.totalVideos || 0} Videos</span>
                    </p>

                    {user?._id == channel?.owner &&                     <div className='flex mt-4 space-x-4 text-sm font-semibold'>
                        <h1 className='text-white'>{user?._id == channel?.owner}</h1>
                        <button onClick={()=>{setCurrVideo(null); toggleVideoModal()}} className=' text-white py-2 px-4 rounded-full bg-white bg-opacity-15'>Upload Videos</button>
                        <button onClick={toggleChannelModal} className='bg-gray-200 py-2 px-4 rounded-full'>Edit Channel</button>
                    </div>}
                </div>
            </div>

    <div className='p-1'>
      {/* Navigation Buttons */}
      <div className='sticky z-20 bg-[#0F0F0F] top-0 pt-12 flex space-x-6 border-b border-[#AAAAAA] pb-0.5 px-2 text-[#AAAAAA]'>
        <button
          className={`focus:outline-none font-semibold py-2 ${activeTab === "Home" ? "border-b-2 border-white" : ""}`}
          onClick={() => setActiveTab("Home")}
        >
          Home
        </button>
        <button
          className={`focus:outline-none font-semibold py-2 ${activeTab === "Videos" ? "border-b-2 border-white" : ""}`}
          onClick={() => setActiveTab("Videos")}
        >
          Videos
        </button>
        <button
          className={`focus:outline-none font-semibold py-2 ${activeTab === "About" ? "border-b-2 border-white" : ""}`}
          onClick={() => setActiveTab("About")}
        >
          About
        </button>
      </div>

      {/* Content Area Based on Active Tab */}
      <div className='mt-1 flex  justify-center min-h-screen'>
        {/* Conditionally render content based on the active tab */}
        {activeTab === "Home" && (
            videos.length !== 0 ? (
            <div className="grid grid-cols-3 w-full mt-4 gap-4">
                {videos.map((video) => (
                <VideoCard key={video._id} video={video} showTheChannel={false} isOwner={user ? user._id === channel?.owner : false} setCurrVideo={setCurrVideo} toggleVideoModal={toggleVideoModal}/>
                ))}
            </div>
            ) : (
            <div className='text-white'>Videos not available</div>
            )
        )}
        {activeTab === "Videos" && (
            videos.length !== 0 ? (
              <div className="grid grid-cols-3 w-full mt-4 gap-4">
                  {videos.map((video) => (
                  <VideoCard key={video._id} video={video} showTheChannel={false} isOwner={user ? user._id === channel?.owner : false}/>
                  ))}
              </div>
              ) : (
              <div className='text-white'>Videos not available</div>
              )
        )}
        {activeTab === "About" && <p className='text-gray-500 w-full text-start h-full mb-auto mt-4'>{channel?.description}</p>}
      </div>
    </div>
    <VideoModal showVideoModal={showVideoModal} toggleVideoModal = { toggleVideoModal} video={currVideo} channelId={channelId} />
    <ChannelModal showModal={showChannelModal} setShowModal={setShowChannelModal} channel={channelId} toggleProfileModal={()=>{console.log("nothing")}} />
        </div>
    );
};

export default ChannelPage;
