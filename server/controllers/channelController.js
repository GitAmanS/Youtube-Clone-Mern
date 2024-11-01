const Channel = require('../models/Channel');
const {bucket} = require('../config/firebase'); // Adjust the path as necessary
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating unique file names

// Create Channel
exports.createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const owner = req.user.id;

    // Upload profile picture to Firebase
    const profilePic = req.file ? await uploadToFirebase(req.file) : null;

    const channel = new Channel({ name, description, owner, profilePic });
    await channel.save();

    res.status(201).json({ message: 'Channel created successfully!', channel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Channel
exports.editChannel = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const { name, description } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Ensure the requester is the channel owner
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this channel' });
    }

    if (name) channel.name = name;
    if (description) channel.description = description;
    await channel.save();

    res.status(200).json({ message: 'Channel updated successfully!', channel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Channel
exports.deleteChannel = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Ensure the requester is the channel owner
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this channel' });
    }

    await Channel.findByIdAndDelete(channelId);
    res.status(200).json({ message: 'Channel deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Video
exports.uploadVideo = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const { title, description } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Ensure the requester is the channel owner
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to upload videos to this channel' });
    }

    // Upload video and thumbnail to Firebase
    const videoUrl = req.files.video ? await uploadToFirebase(req.files.video) : null;
    const thumbnailUrl = req.files.thumbnail ? await uploadToFirebase(req.files.thumbnail) : null;

    const videoData = { title, description, videoUrl, thumbnailUrl };
    await channel.addVideo(videoData);

    res.status(201).json({ message: 'Video uploaded successfully!', video: videoData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Video
exports.editVideo = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const videoId = req.params.videoId;
    const { title, description } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Ensure the requester is the channel owner
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this video' });
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;

    // Handle thumbnail upload
    if (req.files.thumbnail) {
      updatedData.thumbnailUrl = await uploadToFirebase(req.files.thumbnail);
    }

    const updatedVideo = await channel.editVideo(videoId, updatedData);
    if (!updatedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Video updated successfully!', video: updatedVideo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Video
exports.deleteVideo = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const videoId = req.params.videoId;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Ensure the requester is the channel owner
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this video' });
    }

    const deletedVideo = await channel.deleteVideo(videoId);
    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Video deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const videoId = req.params.videoId;
    const { text } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const commentData = {
      text,
      userId: req.user.id,
    };

    await channel.addComment(videoId, commentData);
    res.status(201).json({ message: 'Comment added successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    await channel.deleteComment(videoId, commentId);
    res.status(200).json({ message: 'Comment deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Like/Dislike
exports.toggleLikeVideo = async (req, res) => {
  try {
    // const channelId = req.params.channelId;
    // const videoId = req.params.videoId;

    const {channelId, videoId} = await req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const updatedChannel = await channel.toggleLikeVideo(videoId, req.user.id);
    if (!updatedChannel) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Like/Dislike toggled successfully!', video: updatedChannel.videos.id(videoId) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to upload files to Firebase
const uploadToFirebase = async (file) => {
  const { originalname, buffer } = file;
  const blob = bucket.file(`uploads/${uuidv4()}-${originalname}`); // Use uuid for unique file names
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    })
    .on('error', (error) => {
      reject(`Unable to upload file, error: ${error}`);
    })
    .end(buffer);
  });
};



// Get all videos for a specific channel
exports.getAllVideos = async (req, res) => {
    const { channelId } = req.body;
    try {
        const channel = await Channel.findById(channelId).select('videos');
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        res.status(200).json(channel.videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all comments for a specific video
exports.getCommentsForVideo = async (req, res) => {
    const { channelId, videoId } = req.body;
    try {
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        const video = channel.videos.id(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json(video.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all channels
exports.getAllChannels = async (req, res) => {
    try {
        const channels = await Channel.find();
        res.status(200).json(channels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
