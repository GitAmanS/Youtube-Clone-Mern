// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import videoReducer from './videoReducer';
import authReducer from './authReducer';
import { channelReducer } from './channelReducer';
const rootReducer = combineReducers({
  videos: videoReducer,
  auth: authReducer,
  channel: channelReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
