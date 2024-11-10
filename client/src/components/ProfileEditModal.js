import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { editUser, getUser } from '../redux/authActions';

const ProfileEditModal = ({ isOpen, closeModal }) => {
  // State to hold form data for editing
  const user = useSelector((state)=> state.auth.user); 
  const [editFormData, setEditFormData] = useState({
    username: user.username,
    email: user.email,
  });
   
  const dispatch = useDispatch();
  // State for avatar file
  const [avatar, setAvatar] = useState(null);

  // State for loading/error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle avatar file change
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  // Handle form submit for updating user details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', editFormData.username);
      formData.append('email', editFormData.email);

      // Append avatar file if it's selected
      if (avatar) {
        formData.append('avatar', avatar);
      }

      // Send PUT request with FormData
      const response = await dispatch(editUser(formData));

      // Dispatch the updated user data to your Redux store or handle it as needed
      console.log('Updated user:', user);
      closeModal();  // Close the modal after successful update
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#282828] text-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

        {error && <p className=" mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editFormData.username}
              onChange={handleChange}
              className=" bg-[#282828] w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editFormData.email}
              onChange={handleChange}
              className="w-full bg-[#282828] mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="avatar" className="block text-sm font-medium">Avatar</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-red-700 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
