// authActions.js
import axios from 'axios';

// Set default Axios settings to include credentials (cookies)
axios.defaults.withCredentials = true;



export const AUTH_REQUEST = 'AUTH_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const UPDATE_SUCCESS = 'UPDATE_SUCCESS';
export const GET_REQUEST = 'GET_REQUEST'
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGOUT = 'LOGOUT';


export const GET_CHANNEL_REQUEST = 'GET_CHANNEL_REQUEST';
export const GET_CHANNEL_SUCCESS = 'GET_CHANNEL_SUCCESS';
export const GET_CHANNEL_FAIL = 'GET_CHANNEL_FAIL';


export const getChannel = (channelId) => async (dispatch) =>{
  try {
      dispatch({ type: GET_CHANNEL_REQUEST });
  
      const config = {
        withCredentials: true, 
        params: {}, 
      };
  
      if (channelId) {
        config.params.channelId = channelId;
      }
  
      const { data } = await axios.get(`http://localhost:5000/api/users/getChannel`, config);
      console.log("channel:", data.channel)
      dispatch({
        type: GET_CHANNEL_SUCCESS,
        payload: data.channel,
      });
    } catch (error) {
      console.log("error", error)
      dispatch({
        type: GET_CHANNEL_FAIL,
        payload: error.response?.data?.message || error.message,
      });
  }
}


export const getUser = ()=> async(dispatch)=>{
  try{
    dispatch({type:GET_REQUEST});
    const response = await axios.get('http://localhost:5000/api/users')
    console.log("response:", response.data.user);
    dispatch({ type: UPDATE_SUCCESS, payload: response.data.user });
  }catch(error){
    dispatch({ type: AUTH_ERROR, payload: error.response?.data?.message || error.message });
  }
}

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_REQUEST });
    const response = await axios.post('http://localhost:5000/api/users/register', userData);
    dispatch({ type: REGISTER_SUCCESS, payload: response.data.user });
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.response?.data?.message || error.message });
  }
};

export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_REQUEST });
    const response = await axios.post('http://localhost:5000/api/users/login', userData);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data.user });
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.response?.data?.message || error.message });
  }
};

export const logoutUser = () => (dispatch) => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem('user');
  dispatch({ type: LOGOUT });
};

export const editUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_REQUEST });
    const response = await axios.put('http://localhost:5000/api/users/edit', userData);
    dispatch({ type: UPDATE_SUCCESS, payload: response.data.user });
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.response?.data?.message || error.message });
  }
};