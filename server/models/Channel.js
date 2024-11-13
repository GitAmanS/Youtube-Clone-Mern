const mongoose = require('mongoose');

// Comment Schema (for reuse within videos)
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false }
});

// Video Schema & Model
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnailUrl: String,
  videoUrl: String,
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }, // Reference to the channel
  channelName: { type: String, required: true }, // New field for channel name
  channelProfilePic: { type: String },
}, { timestamps: true });



// Channel Schema & Model
const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video', default: [] }],// Array of Video references
  profilePic: { type: String, required: false },
});

channelSchema.methods.addVideo = async function (videoData) {
  const video = new Video(videoData);
  await video.save(); // Save the video separately
  console.log("video:", video);
  console.log("this.videos before push:", this.videos); // Debugging line
  
  // Ensure `videos` is initialized as an array
  if (!Array.isArray(this.videos)) {
    this.videos = [];
  }

  this.videos.push(video._id); // Add the video ID to the channel's video array
  await this.save(); // Save the channel with the updated videos array
  return video; // Return the saved video
};

// Method to delete a video from the channel
channelSchema.methods.deleteVideo = async function (videoId) {
  // Remove the video from the `videos` array of the channel
  this.videos = this.videos.filter(id => id.toString() !== videoId.toString());
  
  // Save the channel with the updated videos array
  await this.save();

  // Delete the video document itself from the `Video` collection
  await Video.findByIdAndDelete(videoId);

  return { message: 'Video deleted successfully' };
};


channelSchema.methods.editVideo = async function (videoId, updatedData) {
  // Find the video by ID
  const video = await Video.findById(videoId);
  if (!video) {
    throw new Error('Video not found');
  }

  // Ensure that the video belongs to this channel (optional)
  if (!this.videos.includes(videoId)) {
    throw new Error('Video does not belong to this channel');
  }

  // Update the video with the new data (title, description, etc.)
  Object.assign(video, updatedData); // Merge the updated data into the video document
  await video.save(); // Save the updated video

  // If thumbnail URL was updated, update the video object with the new thumbnail URL
  if (updatedData.thumbnailUrl) {
    video.thumbnailUrl = updatedData.thumbnailUrl;
    await video.save();
  }

  // Save the updated video to the channel's `videos` array (if needed)
  // Since the `videoId` is already in the channel's `videos` array, no need to add it again
  await this.save(); // Save the channel with the updated video details (though the `videos` array remains unchanged)

  return video; // Return the updated video
};


// Add Comment
videoSchema.methods.addComment = async function (userId, text) {
  const comment = { userId, text }; // Creating a comment object based on schema
  this.comments.push(comment); // Add the comment to the comments array
  await this.save(); // Save the video with the updated comments array
  return comment; // Return the added comment
};

// Edit Comment
videoSchema.methods.editComment = async function (commentId, userId, newText) {
  const comment = this.comments.id(commentId); // Find comment by ID
  if (!comment) throw new Error('Comment not found');
  if (comment.userId.toString() !== userId.toString()) {
    throw new Error('You are not authorized to edit this comment');
  }

  comment.text = newText; // Update the comment's text
  comment.edited = true;
  await this.save(); // Save the video with the edited comment
  return comment; // Return the updated comment
};

// Delete Comment
videoSchema.methods.deleteComment = async function (commentId, userId) {
  const commentIndex = this.comments.findIndex(c => c._id.toString() === commentId); // Find comment index by ID
  if (commentIndex === -1) throw new Error('Comment not found'); // Check if comment exists
  if (this.comments[commentIndex].userId.toString() !== userId.toString()) {
    throw new Error('You are not authorized to delete this comment');
  }

  // Remove the comment from the comments array
  this.comments.splice(commentIndex, 1); // Remove the comment by index
  await this.save(); // Save the video with the updated comments array
  return { message: 'Comment deleted successfully' };
};

// Method to get all comments for a video
videoSchema.methods.getComments = function () {
  return this.comments; // Return the comments array
};


const Channel = mongoose.model('Channel', channelSchema); // Independent Channel model
const Video = mongoose.model('Video', videoSchema); // Independent Video model
module.exports = { Channel, Video };
