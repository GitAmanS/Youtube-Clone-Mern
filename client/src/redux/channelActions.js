// channelActions.js
import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:5000/api/channel';

// Action types
export const CREATE_CHANNEL_REQUEST = 'CREATE_CHANNEL_REQUEST';
export const CREATE_CHANNEL_SUCCESS = 'CREATE_CHANNEL_SUCCESS';
export const CREATE_CHANNEL_FAIL = 'CREATE_CHANNEL_FAIL';

export const EDIT_CHANNEL_REQUEST = 'EDIT_CHANNEL_REQUEST';
export const EDIT_CHANNEL_SUCCESS = 'EDIT_CHANNEL_SUCCESS';
export const EDIT_CHANNEL_FAIL = 'EDIT_CHANNEL_FAIL';

export const DELETE_CHANNEL_REQUEST = 'DELETE_CHANNEL_REQUEST';
export const DELETE_CHANNEL_SUCCESS = 'DELETE_CHANNEL_SUCCESS';
export const DELETE_CHANNEL_FAIL = 'DELETE_CHANNEL_FAIL';


export const GETVIDEOS_CHANNEL_REQUEST = 'GETVIDEOS_CHANNEL_REQUEST';
export const GETVIDEOS_CHANNEL_SUCCESS = 'GETVIDEOS_CHANNEL_SUCCESS';
export const GETVIDEOS_CHANNEL_FAIL = 'GETVIDEOS_CHANNEL_FAIL';




// Create Channel Action
export const createChannel = (name, description, avatarFile) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CHANNEL_REQUEST });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (avatarFile) formData.append('avatar', avatarFile);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,  // Include credentials (cookies) with the request
    };

    const { data } = await axios.post(API_URL, formData, config);

    dispatch({
      type: CREATE_CHANNEL_SUCCESS,
      payload: data.channel,
    });
  } catch (error) {
    dispatch({
      type: CREATE_CHANNEL_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Edit Channel Action
export const editChannel = (channelId, name, description, avatarFile) => async (dispatch) => {
  try {
    dispatch({ type: EDIT_CHANNEL_REQUEST });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('channelId', channelId);
    if (avatarFile) formData.append('avatar', avatarFile);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,  // Include credentials (cookies) with the request
    };

    const { data } = await axios.put(`${API_URL}`, formData, config);

    dispatch({
      type: EDIT_CHANNEL_SUCCESS,
      payload: data.channel,
    });
  } catch (error) {
    dispatch({
      type: EDIT_CHANNEL_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


// get Channel Videos
export const getChannelVideos = (channelId) => async (dispatch) => {
    try {
        console.log("get Channel videos hit from channel: ", channelId)
      dispatch({ type: GETVIDEOS_CHANNEL_REQUEST });
  
      const config = {
        withCredentials: true,  // Include credentials (cookies) with the request
        params: {channelId}
      };
  
      const response = await axios.get(`http://localhost:5000/api/channel/channelVideos`, config);
      console.log("reponse:", response.data.videos)
  
      dispatch({
        type: GETVIDEOS_CHANNEL_SUCCESS,
        payload: response.data.videos,
      });
    } catch (error) {
      dispatch({
        type: GETVIDEOS_CHANNEL_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };




// Delete Channel Action
export const deleteChannel = (channelId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CHANNEL_REQUEST });

    const config = {
      withCredentials: true,  // Include credentials (cookies) with the request
    };

    const { data } = await axios.delete(`${API_URL}`, {
      data: { channelId },
      ...config,
    });

    dispatch({
      type: DELETE_CHANNEL_SUCCESS,
      payload: channelId,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CHANNEL_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


