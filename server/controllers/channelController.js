const {Channel, Video} = require('../models/Channel');
const User = require('../models/User')
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

    const user = await User.findById(owner);


    

    const channel = new Channel({ name, description, owner, profilePic });
    await user.channels.push(channel);
    await user.save();
    await channel.save();
    console.log("channel created successfully", channel)
    res.status(201).json({ message: 'Channel created successfully!', channel, user });
  } catch (error) {
    console.log("error:",error)
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

    res.status(200).json({ message: 'Channel updated successfully!', channel, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Channel
exports.deleteChannel = async (req, res) => {
  try {
    // const channelId = req.params.channelId;
    const {channelId} = req.body;
    const owner = req.user.id;

    const user = await User.findById(owner);

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Ensure the requester is the channel owner
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this channel' });
    }

    user.channels = [];
    await user.save();
    await Channel.findByIdAndDelete(channelId);
    res.status(200).json({ message: 'Channel deleted successfully!', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Video
exports.uploadVideo = async (req, res) => {
    try {
      const { title, description, channelId } = req.body;

      console.log("upload video:", req.body)
  
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
      const videoData = { title, description, videoUrl, thumbnailUrl, channelId, channelName:channel.name, channelProfilePic:channel.profilePic };
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

    console.log(req.body)

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

    // Only handle thumbnail upload if the thumbnail is provided in the request
    if (req.files && req.files.thumbnail) {
      updatedData.thumbnailUrl = await uploadToFirebase(req.files.thumbnail);
    }

    const updatedVideo = await channel.editVideo(videoId, updatedData);
    if (!updatedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Video updated successfully!', video: updatedVideo });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: error.message });
  }
};


// Delete Video
exports.deleteVideo = async (req, res) => {
    try {
        const { channelId, videoId } = req.query;

        console.log("reqbody:", req.body)

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
    console.log("req.body:", req.body)
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


// Get all comments for a specific video with populated user info
exports.getCommentsForVideo = async (req, res) => {
  try {
    const { videoId } = req.query; // Assuming videoId is passed as a URL parameter

    console.log("getcomments video:", videoId);

    // Fetch the video and populate user data for each comment
    const video = await Video.findById(videoId)
      .populate({
        path: 'comments.userId', // Populate the userId inside the comments array
        select: 'username avatar' // Specify which user fields to include
      });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Return the populated comments as a response
    res.status(200).json(video.comments);
  } catch (error) {
    console.log("error:", error)
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
    
    try {
        // Find the channel
        const {channelId} = req.query;
        const channel = await Channel.findById(channelId).populate('videos');
        
        if (!channel) {
          return res.status(404).json({ message: 'Channel not found' });
        }
    

        res.status(200).json({quantity:channel.videos.length, videos: channel.videos});
      } catch (error) {
        console.log("error:", error)
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





exports.fetchSingleVideo = async(req, res)=>{
  const videoId = req.query.id;
  console.log("videoId:",req.query.id);

  try{
    const video = await Video.findById(videoId);

    if(!video){
      return res.status(404).json({message:"Video Not found"})
    }

    res.status(200).json(video);
  } catch(error){
    console.error("Error fetching video:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}




// Search Videos Controller
exports.searchVideos = async (req, res) => {
  console.log("this been hit")
  const { query, page = 1, limit = 10 } = req.query; // Default: page 1, 10 items per page
  const title = query;
  console.log('query:', req.query)
  if (!title) {
    return res.status(400).json({ message: 'Title query parameter is required' });
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const videos = await Video.find({
      title: { $regex: title } 
    })
    .skip(skip)
    .limit(limitNumber);

    const totalVideos = await Video.countDocuments({
      title: { $regex: title, $options: 'i' }
    });

    if (!videos.length) {
      return res.status(404).json({ message: 'No videos found matching the title' });
    }

    res.status(200).json({
      page: pageNumber,
      totalPages: Math.ceil(totalVideos / limitNumber),
      totalVideos,
      videos
    });
  } catch (error) {
    console.error("Error searching for videos:", error.message || error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




exports.fetchVideos = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 9;
  const skip = (page - 1) * limit;

  try {
    const videos = await Video.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const totalVideos = await Video.countDocuments();
    const hasMore = (skip + videos.length) < totalVideos;

    console.log("total videos sent:", videos.length)

    return res.status(200).json({
      videos,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.DeleteAllVideos = async(req,res)=>{
  try {
      const result = await Video.deleteMany({}); // Deletes all videos
      res.status(200).json({ message: 'All videos deleted successfully', result });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting videos', error });
  }
}
