import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const CommentSection = ({ initialComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [showCommentButtons, setShowCommentButtons] = useState(false);

  // Function to handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObject = {
        id: comments.length + 1,
        userId: "user123",  // Replace with dynamic user ID as needed
        profilePic: "https://example.com/profile.jpg",  // Replace with actual profile image URL
        commentText: newComment,
        timestamp: "Just now",
        likes: 0,
        dislikes: 0
      };
      setComments([newCommentObject, ...comments]);
      setNewComment('');
      setShowCommentButtons(false);
    }
  };

  // Function to handle like or dislike
  const handleReaction = (id, type) => {
    setComments(comments.map(comment => 
      comment.id === id ? {
        ...comment,
        likes: type === 'like' ? comment.likes + 1 : comment.likes,
        dislikes: type === 'dislike' ? comment.dislikes + 1 : comment.dislikes
      } : comment
    ));
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 text-white bg-gray-900 rounded-lg">
      {/* Comment count */}
      <h2 className="text-lg font-semibold mb-4">{comments.length} Comments</h2>

      {/* New comment input */}
      <div className="flex items-center mb-4">
        <img
          src="https://example.com/your-profile.jpg"  // Replace with user's profile image
          alt="Profile"
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="flex-grow">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setShowCommentButtons(true)}
            placeholder="Add a comment..."
            className="w-full bg-gray-800 text-white p-2 rounded-lg"
          />
          {showCommentButtons && (
            <div className="flex mt-2">
              <button
                onClick={() => {
                  setNewComment('');
                  setShowCommentButtons(false);
                }}
                className="mr-2 px-4 py-1 text-sm bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments list */}
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start mb-4">
            <img
              src={comment.profilePic}
              alt={comment.userId}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <span className="text-sm font-semibold mr-2">{comment.userId}</span>
                <span className="text-xs text-gray-500">{comment.timestamp} ago</span>
              </div>
              <p className="text-sm mb-2">{comment.commentText}</p>
              <div className="flex items-center text-gray-500 text-xs">
                <button
                  onClick={() => handleReaction(comment.id, 'like')}
                  className="flex items-center mr-4"
                >
                  <FaThumbsUp className="mr-1" /> {comment.likes}
                </button>
                <button
                  onClick={() => handleReaction(comment.id, 'dislike')}
                  className="flex items-center"
                >
                  <FaThumbsDown className="mr-1" /> {comment.dislikes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
