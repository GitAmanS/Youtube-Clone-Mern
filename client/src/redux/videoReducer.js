// videoReducer.js
import {
  FETCH_VIDEOS_REQUEST,
  FETCH_VIDEOS_SUCCESS,
  FETCH_VIDEOS_FAILURE,
  FETCH_SINGLE_VIDEO_REQUEST,
  FETCH_SINGLE_VIDEO_SUCCESS,
  FETCH_SINGLE_VIDEO_FAILURE,
} from './videoActions';

const initialState = {
  videos: [],
  loading: false,
  error: null,
  hasMore: true,
  videoToPlay: null,
  searchResults: [], 
  comments:[],
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VIDEOS_REQUEST:
      return { ...state, loading: true };
    case FETCH_VIDEOS_SUCCESS:
      const newVideos = action.payload.videos.filter(
        (video) => !state.videos.some((existingVideo) => existingVideo._id === video._id)
      );
      return {
        ...state,
        loading: false,
        videos: [...state.videos, ...newVideos], 
        hasMore: action.payload.hasMore,
      };
    case FETCH_VIDEOS_FAILURE:
      return { ...state, loading: false, error: action.payload };


    // Handle fetching a single video
    case FETCH_SINGLE_VIDEO_REQUEST:
      return { ...state, loading: true, videoToPlay: null }; 
    case FETCH_SINGLE_VIDEO_SUCCESS:
      return {
        ...state,
        loading: false,
        videoToPlay: action.payload, 
      };
    case FETCH_SINGLE_VIDEO_FAILURE:
      return { ...state, loading: false, error: action.payload };


      case 'SEARCH_VIDEOS_REQUEST':
        return { ...state, loading: true, searchResults: [] }; // Clear previous results on new search
      case 'SEARCH_VIDEOS_SUCCESS':
        return {
          ...state,
          loading: false,
          searchResults: action.payload.videos, // Replace with new search results
        };
      case 'SEARCH_VIDEOS_FAIL':
        return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default videoReducer;
