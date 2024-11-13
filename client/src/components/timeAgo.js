// timeAgo.js
import { formatDistanceToNow } from 'date-fns';

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date) + ' ago';
};

export default timeAgo;
