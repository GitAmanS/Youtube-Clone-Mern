const express = require('express');
const upload = require("../config/multer")
const { authenticateUser } = require('../middleware/auth');
const channelController = require('../controllers/channelController')
const router = express.Router();



// Route to create a channel
router.post('/', authenticateUser, upload.single('profilePic'), channelController.createChannel);

// Route to edit a channel
router.put('/:channelId', authenticateUser, channelController.editChannel);

// Route to delete a channel
router.delete('/:channelId', authenticateUser, channelController.deleteChannel);

// Route to upload a video
router.post('/:channelId/videos', authenticateUser, upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), channelController.uploadVideo);

// Route to edit a video
router.put('/:channelId/videos/:videoId', authenticateUser, upload.single('thumbnail'), channelController.editVideo);

// Route to delete a video
router.delete('/:channelId/videos/:videoId', authenticateUser, channelController.deleteVideo);

// Route to add a comment to a video
router.post('/:channelId/videos/:videoId/comments', authenticateUser, channelController.addComment);

// Route to delete a comment from a video
router.delete('/:channelId/videos/:videoId/comments/:commentId', authenticateUser, channelController.deleteComment);

// Route to toggle like/dislike on a video
router.post('/:channelId/videos/:videoId/like', authenticateUser, channelController.toggleLikeVideo);

router.get('/getAllChannels', channelController.getAllChannels);

router.get('/getComments', channelController.getCommentsForVideo);

router.get('/getAllVideos', channelController.getAllVideos)
module.exports = router;
