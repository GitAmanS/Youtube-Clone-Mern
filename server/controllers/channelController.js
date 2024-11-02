const {Channel, Video} = require('../models/Channel');
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
    // const channelId = req.params.channelId;
    const { name, description, channelId } = req.body;

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
    // const channelId = req.params.channelId;
    const {channelId} = req.body;
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
      const { title, description, channelId } = req.body;
  
      // Check if channel exists
      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
  
      // Ensure the requester is the channel owner
      if (channel.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to upload videos to this channel' });
      }
  
      // Upload video and thumbnail to Firebase
      const videoUrl = req.files.video[0] ? await uploadToFirebase(req.files.video[0]) : null;
      const thumbnailUrl = req.files.thumbnail[0] ? await uploadToFirebase(req.files.thumbnail[0]) : null;
  
      // Set video data including channelId reference
      const videoData = { title, description, videoUrl, thumbnailUrl, channelId };
      const savedVideo = await channel.addVideo(videoData); // Save video
  
      res.status(201).json({ message: 'Video uploaded successfully!', video: savedVideo });
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
// Edit Video
exports.editVideo = async (req, res) => {
  try {
    const { title, description, channelId, videoId } = req.body;

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
        const { channelId, videoId } = req.body;

        // Find the channel
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        // Ensure the requester is the channel owner
        if (channel.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this video' });
        }

        // Find the video
        const videoToDelete = await Video.findByIdAndDelete(videoId);
        if (!videoToDelete) {
            return res.status(404).json({ message: 'Video not found' });
        }
        
        const videoUrl = videoToDelete.videoUrl; // Firebase URL of the video
        let deletionSuccess = true; // Flag to track Firebase deletion status

        if (videoUrl) {
            const fileName = videoUrl.split('/').pop(); // Get the file name from the URL
            
            // Attempt to delete the video file from Firebase
            const file = bucket.file(`uploads/${fileName}`);
            try {
                await file.delete();
            } catch (firebaseError) {
                console.error('Firebase deletion failed:', firebaseError);
                deletionSuccess = false; // If deletion fails, update the flag
            }
        } else {
            console.warn('Video URL not found, skipping Firebase deletion.');
        }

        // Remove the video ID from the channel's videos array
        channel.videos.pull(videoId);
        await channel.save(); // Save the updated channel

        // If the video was not found in Firebase, inform the user
        if (!deletionSuccess) {
            return res.status(200).json({ message: 'Video was not found in Firebase, but deleted from the database.' });
        }

        res.status(200).json({ message: 'Video deleted successfully from both Firebase and the database!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

  

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    

    await video.addComment(req.user.id, text);
    res.status(201).json({ message: 'Comment added successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Comment Controller
exports.editComment = async (req, res) => {
    const {  text, videoId, commentId } = req.body; // Extract userId and newText from the request body
    const userId = req.user.id;
    try {
      // Find the video by its ID
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Use the editComment method to update the comment
      const updatedComment = await video.editComment(commentId, userId, text);
  
      // Return the updated comment
      return res.status(200).json(updatedComment);
    } catch (error) {
      // Handle errors, such as comment not found or unauthorized access
      console.log("error:", error)
      return res.status(400).json({ message: error.message });
    }
  };

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {

    const { videoId, commentId} = req.body;
    const userId = req.user.id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.deleteComment(commentId, userId);
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

// Helper function to upload files to Firebase and make them publicly accessible
const uploadToFirebase = async (file) => {
    const { originalname, buffer } = file;
    const blob = bucket.file(`uploads/${uuidv4()}-${originalname}`); // Use UUID for unique file names
  
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });
  
    return new Promise((resolve, reject) => {
      blobStream
        .on('finish', async () => {
          try {
            // Make the file publicly accessible
            await blob.makePublic();
  
            // Generate and return the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          } catch (error) {
            reject(`Unable to make file public, error: ${error}`);
          }
        })
        .on('error', (error) => {
          reject(`Unable to upload file, error: ${error}`);
        })
        .end(buffer);
    });
  };



// Get all videos for a specific channel
exports.getAllVideos = async (req, res) => {
    // const { channelId } = req.body;
    try {
        const channel = await Video.find();
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        res.status(200).json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all comments for a specific video
exports.getCommentsForVideo = async (req, res) => {
    try {
        const { videoId } = req.body; // Assuming videoId is passed as a URL parameter
    
        const video = await Video.findById(videoId);
        if (!video) {
          return res.status(404).json({ message: 'Video not found' });
        }
    
        const comments = video.getComments(); // Use the method to get comments
        res.status(200).json(comments); // Return the comments as a response
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

exports.getChannelVideos = async(req, res)=>{
    const {channelId} = req.body;
    try {
        // Find the channel
        const channel = await Channel.findById(channelId).populate('videos');
        console.log("channel videos:", channel)
        if (!channel) {
          return res.status(404).json({ message: 'Channel not found' });
        }
    
        // Return the videos associated with the channel
        res.status(200).json(channel.videos);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

exports.checkIsOwner = async (req, res) => {
    try {
        console.log("this is hit");
        const { channelId } = req.body;
        console.log(req.user, req.body);

        // Find channel by ID
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Check if the requesting user is the channel owner
        if (channel.owner.toString() === req.user.id) {
            return res.status(200).json({ message: "You are the channel owner" });
        } else {
            return res.status(403).json({ message: "You are not the owner" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
