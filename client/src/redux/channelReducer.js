import {
    CREATE_CHANNEL_REQUEST,
    CREATE_CHANNEL_SUCCESS,
    CREATE_CHANNEL_FAIL,
    EDIT_CHANNEL_REQUEST,
    EDIT_CHANNEL_SUCCESS,
    EDIT_CHANNEL_FAIL,
    DELETE_CHANNEL_REQUEST,
    DELETE_CHANNEL_SUCCESS,
    DELETE_CHANNEL_FAIL,
    GETVIDEOS_CHANNEL_REQUEST,
    GETVIDEOS_CHANNEL_SUCCESS,
    GETVIDEOS_CHANNEL_FAIL,
 } from './channelActions'

// channelReducer.js
const initialState = {
    channels: [],
    channelVideos:[],
    loading: false,
    error: null,
  };
  
  export const channelReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_CHANNEL_REQUEST:
      case EDIT_CHANNEL_REQUEST:
      case DELETE_CHANNEL_REQUEST:
      case GETVIDEOS_CHANNEL_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case CREATE_CHANNEL_SUCCESS:
        return {
          ...state,
          loading: false,
          channels: [...state.channels, action.payload],
        };
      case EDIT_CHANNEL_SUCCESS:
        return {
          ...state,
          loading: false,
          channels: state.channels.map((channel) =>
            channel._id === action.payload._id ? action.payload : channel
          ),
        };
        case GETVIDEOS_CHANNEL_SUCCESS:
            return {
              ...state,
              loading: false,
              channelVideos: action.payload,
            };
      case DELETE_CHANNEL_SUCCESS:
        return {
          ...state,
          loading: false,
          channels: state.channels.filter((channel) => channel._id !== action.payload),
        };
      case CREATE_CHANNEL_FAIL:
      case EDIT_CHANNEL_FAIL:
      case DELETE_CHANNEL_FAIL:
      case GETVIDEOS_CHANNEL_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  