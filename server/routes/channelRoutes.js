// channelRoutes.js
const express = require('express');
const upload = require("../config/multer")
const { authenticateUser } = require('../middleware/auth');
const channelController = require('../controllers/channelController')
const router = express.Router();
const multer = require("multer")

// Middleware to capture Multer errors
function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
      // Catch Multer-specific errors
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // General error handling
      return res.status(500).json({ message: `Server error: ${err.message}` });
    }
    next();
  }

// Route to create a channel
router.post('/', authenticateUser, upload.single('avatar'), channelController.createChannel);

// Route to edit a channel
router.put('/', authenticateUser, channelController.editChannel);

// Route to delete a channel
router.delete('/', authenticateUser, channelController.deleteChannel);



// Route to upload a video
router.post(
    '/videos',
    authenticateUser,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    multerErrorHandler,
    channelController.uploadVideo
  );
  
// Route to edit a video
router.put('/videos', authenticateUser, upload.single('thumbnail'), channelController.editVideo);
  
// Route to delete a video
router.delete('/videos', authenticateUser, channelController.deleteVideo);


// Route to add a comment to a video
router.post('/comments', authenticateUser, channelController.addComment);

//getting commments for video
router.get('/getComments', channelController.getCommentsForVideo);

// Route to delete a comment from a video
router.delete('/comments', authenticateUser, channelController.deleteComment);

router.put('/comments', authenticateUser, channelController.editComment)

// Route to toggle like/dislike on a video
router.post('/like', authenticateUser, channelController.toggleLikeVideo);

router.get('/getAllChannels', channelController.getAllChannels);



router.get('/getAllVideos', channelController.getAllVideos);

router.get('/channelVideos', channelController.getChannelVideos);

router.get('/checkOwner', authenticateUser, channelController.checkIsOwner);

router.get('/fetchVideos', channelController.fetchVideos);

router.get('/fetchSingleVideo', channelController.fetchSingleVideo)

router.delete('/deleteAllVideos', authenticateUser, channelController.DeleteAllVideos)

router.get('/searchVideos', channelController.searchVideos)

module.exports = router;
