// routes.js
import ChannelPage from './ChannelPage';
import Home from './Home';
import SearchResults from './SearchResults';
import VideoDetailPage from './VideoDetailPage';

const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/video/:videoId', component: VideoDetailPage },
  { path:'/search', component: SearchResults},
  { path:'/channel/:channelId', component: ChannelPage}
];

export default routes;
