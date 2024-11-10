import {
  AUTH_REQUEST,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  UPDATE_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  GET_CHANNEL_REQUEST,
  GET_CHANNEL_SUCCESS,
  GET_CHANNEL_FAIL
} from './authActions';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  mychannel: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, loading: true, error: null };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case UPDATE_SUCCESS:
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { ...state, loading: false, user: action.payload, error: null };
    case GET_CHANNEL_FAIL:
    case AUTH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      localStorage.removeItem('user');
      return { ...state, user: null, error: null };
    case GET_CHANNEL_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_CHANNEL_SUCCESS:
      return { ...state, loading: false, mychannel: action.payload, error: null };

    default:
      return state;
  }
};

export default authReducer;
