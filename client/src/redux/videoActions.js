// videoActions.js
import axios from 'axios';

export const FETCH_VIDEOS_REQUEST = 'FETCH_VIDEOS_REQUEST';
export const FETCH_VIDEOS_SUCCESS = 'FETCH_VIDEOS_SUCCESS';
export const FETCH_VIDEOS_FAILURE = 'FETCH_VIDEOS_FAILURE';
export const FETCH_SINGLE_VIDEO_REQUEST = 'FETCH_SINGLE_VIDEO_REQUEST';
export const FETCH_SINGLE_VIDEO_SUCCESS = 'FETCH_SINGLE_VIDEO_SUCCESS';
export const FETCH_SINGLE_VIDEO_FAILURE = 'FETCH_SINGLE_VIDEO_FAILURE';

// Fetch all videos
export const fetchVideos = (page, limit = 6) => async (dispatch) => {
  dispatch({ type: FETCH_VIDEOS_REQUEST });
  try {
    const response = await axios.get(`http://localhost:5000/api/channel/fetchVideos?page=${page}&limit=${limit}`);
    dispatch({
      type: FETCH_VIDEOS_SUCCESS,
      payload: {
        videos: response.data.videos,
        hasMore: response.data.hasMore,
      },
    });
  } catch (error) {
    dispatch({
      type: FETCH_VIDEOS_FAILURE,
      payload: error.message,
    });
  }
};

// Fetch a single video by ID
export const fetchSingleVideo = (id) => async (dispatch) => {
  dispatch({ type: FETCH_SINGLE_VIDEO_REQUEST });
  try {
    const response = await axios.get(`http://localhost:5000/api/channel/fetchSingleVideo?id=${id}`);
    console.log(response.data)
    dispatch({
      type: FETCH_SINGLE_VIDEO_SUCCESS,
      payload: response.data, // Assuming the API returns the video object
    });
  } catch (error) {
    dispatch({
      type: FETCH_SINGLE_VIDEO_FAILURE,
      payload: error.message,
    });
  }
};


// Action to search videos based on the query
export const searchVideos = (query, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: 'SEARCH_VIDEOS_REQUEST' });

    const { data } = await axios.get(`http://localhost:5000/api/channel/searchVideos`, {
      params: { query, page, limit }
    });

    console.log("data:",)

    dispatch({
      type: 'SEARCH_VIDEOS_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'SEARCH_VIDEOS_FAIL',
      payload: error.response?.data?.message || error.message,
    });
  }
};



export const uploadVideo = async (formData) => {
  try {
    // const formData = new FormData();
    // formData.append('title', videoData.title);
    // formData.append('description', videoData.description);
    // formData.append('channelId', videoData.channelId);
    
    // if (videoData.videoFile) {
    //   formData.append('video', videoData.videoFile);
    // }
    
    // if (videoData.thumbnailFile) {
    //   formData.append('thumbnail', videoData.thumbnailFile);
    // }
    
    const response = await axios.post('http://localhost:5000/api/channel/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Returns success message and uploaded video details
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error.response?.data || 'Error uploading video';
  }
};



export const editVideo = async (formData) => {
  try {


    const response = await axios.put(`http://localhost:5000/api/channel/videos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Returns success message and updated video details
  } catch (error) {
    console.error('Error editing video:', error);
    throw error.response?.data || 'Error editing video';
  }
};





export const deleteVideo = async (videoId, channelId) => {
  try {
    const response = await axios.delete('http://localhost:5000/api/channel/videos', {
      params: {
        videoId,  
        channelId 
      }
    });
    return response.data; // Returns success message after deletion
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error.response?.data || 'Error deleting video';
  }
};



// Add Comment
export const addComment = async (videoId, text) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/channel/comments`,
      { videoId, text },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get Comments for Video
export const getCommentsForVideo = async (videoId) => {
  try {
    console.log("videoId:", videoId)
    const response = await axios.get(
      `http://localhost:5000/api/channel/getComments`,
      { params: { videoId }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Edit Comment
export const editComment = async (videoId, commentId, text) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/channel/comments`,
      { videoId, commentId, text },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing comment:', error);
    throw error;
  }
};

// Delete Comment
export const deleteComment = async (videoId, commentId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/channel/comments`,
      {
        data: { videoId, commentId },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};