import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { searchVideos } from '../redux/videoActions';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchResults = useSelector(state => state.videos.searchResults);
  const navigate = useNavigate();

  console.log("Search Results:", searchResults)

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (query) {
      dispatch(searchVideos(query, page));
    }
  }, [query, page, dispatch]);

  const loadMore = () => setPage(prev => prev + 1);

  return (
    <div className="search-results-page min-h-screen">
      <h2 className="text-xl mb-4">{`Results for "${query}"`}</h2>
      <div className="video-grid grid gap-6 p-4">
  {searchResults.map(video => (
    <div onClick={()=>{navigate(`/video/${video._id}`)}} key={video._id} className="video-card flex space-x-4 p-4 rounded-lg shadow-md px-4 pl-4">
      
        {/* Video Thumbnail - 50% width */}
        <div className="relative w-1/2 h-fit " >
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className=" top-0 left-0 h-full w-full rounded-xl"
          />
          <div className="absolute flex items-center justify-center bottom-2 right-2 bg-black bg-opacity-70 text-white font-medium text-xs px-[2px] py-[1px] rounded">
            {video.duration ? video.duration : "10:00"} {/* Assuming `duration` is a property in video object */}
          </div>
        </div>


          {/* Video Details - 50% width */}
          <div className="w-1/2">
            {/* Title */}
            <h3 className="text-lg text-white">{video.title}</h3>
            <p className="text-[#AAAAAA] text-sm">
              {video.views} • uploaded ago {/* This text can be dynamically updated based on the video's upload time */}
            </p>

            {/* Channel Info */}
            <div className="flex items-center space-x-2 mt-2">
              <img 
                src={video.channelLogoUrl} 
                alt="Channel Logo" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-[#AAAAAA]">{video.channelName}</span>
            </div>

            {/* Description (first two lines) */}
            <p className="mt-2 text-sm text-[#AAAAAA] line-clamp-2">
              {video.description}{"..."}
            </p>
          </div>
    </div>
  ))}
</div>

      <button onClick={loadMore} className="load-more-button">
        Load More
      </button>
    </div>
  );
};

export default SearchResults;
