const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnailUrl: String,
  videoUrl: String,
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
});

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  videos: [videoSchema],
  profilePic: { type: String, required: false },
});

// Embedded methods for channel management
channelSchema.methods.addVideo = function (videoData) {
  this.videos.push(videoData);
  return this.save();
};

channelSchema.methods.editVideo = function (videoId, updatedData) {
  const video = this.videos.id(videoId);
  if (video) {
    Object.assign(video, updatedData);
    return this.save();
  }
  return null;
};

channelSchema.methods.deleteVideo = function (videoId) {
  this.videos.id(videoId).remove();
  return this.save();
};

channelSchema.methods.toggleLikeVideo = function (videoId, userId) {
  const video = this.videos.id(videoId);
  if (video) {
    if (video.likes.includes(userId)) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.dislikes.pull(userId);
    }
    return this.save();
  }
  return null;
};

channelSchema.methods.addComment = function (videoId, commentData) {
  const video = this.videos.id(videoId);
  if (video) {
    video.comments.push(commentData);
    return this.save();
  }
  return null;
};

channelSchema.methods.deleteComment = function (videoId, commentId) {
  const video = this.videos.id(videoId);
  if (video) {
    video.comments.id(commentId).remove();
    return this.save();
  }
  return null;
};

module.exports = mongoose.model('Channel', channelSchema);
