import React, { useState } from 'react';

const UserProfileModal = ({ user, onClose, onSignOut }) => {
  const hasChannel = user.channels && user.channels.length > 0; // Check if the user has a channel

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          <img
            src={user.profilePic} // Replace with actual user profile picture URL
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          {/* Username */}
          <div className="text-xl font-semibold">{user.username}</div>
        </div>
        
        {/* Create/View Channel Section */}
        <div className="mt-4">
          {hasChannel ? (
            <button className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              View Your Channel
            </button>
          ) : (
            <button className="w-full py-2 px-4 text-white bg-green-600 rounded-md hover:bg-green-700">
              Create Channel
            </button>
          )}
        </div>

        {/* Sign Out Button */}
        <div className="mt-4">
          <button
            className="w-full py-2 px-4 text-white bg-red-600 rounded-md hover:bg-red-700"
            onClick={onSignOut}
          >
            Sign Out
          </button>
        </div>

        {/* Close Modal Button */}
        <div className="mt-4 text-center">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
