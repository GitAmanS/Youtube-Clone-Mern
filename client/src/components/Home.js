import React, { useEffect } from 'react';
import VideoCard from './VideoCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../redux/videoActions';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import VideoTopics from './VideoTopics';

const Home = () => {
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.videos);
  const hasMore = useSelector((state) => state.videos.hasMore);
  const status = useSelector((state) => state.videos.status);

  

  useEffect(() => {
    dispatch(fetchVideos(1)); // Start with page 1
  }, [dispatch]);

  const loadMoreVideos = () => {
    if (status !== 'loading') {
      const nextPage = Math.ceil(videos.length / 9) + 1; // Page number based on videos loaded and limit
      dispatch(fetchVideos(nextPage));
    }
  };

  return (
    <div className="flex flex-col min-h-screen h-auto">
      <VideoTopics/>

      <main className="flex-grow ml-16 p-4">
        <InfiniteScroll
          dataLength={videos.length} // Current length of videos in the state
          next={loadMoreVideos} // Load more videos
          hasMore={hasMore} // Check if more videos are available
          loader={<h4 className="w-full text-center text-white">Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>

            </p>
          }
        >
          <div className="grid grid-cols-3 mt-20 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </InfiniteScroll>
      </main>
    </div>
  );
};

export default Home;
