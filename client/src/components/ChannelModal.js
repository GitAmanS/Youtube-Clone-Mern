import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel, editChannel, deleteChannel } from '../redux/channelActions';
import { getUser, getChannel } from '../redux/authActions';

const ChannelModal = ({ showModal, setShowModal,toggleProfileModal }) => {
  const channel = useSelector((state)=> state.auth.mychannel);
  const [name, setName] = useState(channel ? channel.name : '');
  const [description, setDescription] = useState(channel ? channel.description : '');
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();
  
  
  useEffect(()=>{
    dispatch(getChannel())
  },[])


//   console.log("channel:", channel)

  // For handling the modal close
  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (channel) {
      // Edit channel
      await dispatch(editChannel(channel._id, name, description, avatar));
      dispatch(getUser())
    } else {
      // Create channel
      await dispatch(createChannel(name, description, avatar));
      dispatch(getUser())
    }

    closeModal();
    toggleProfileModal();
  };

  // For handling delete (only for editing)
  const handleDelete = async() => {
    if (channel) {
      await dispatch(deleteChannel(channel._id));
      dispatch(getUser())
      closeModal();
    }
  };

  return (
    <>
      {/* Modal Background */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full sm:w-96 p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{channel ? 'Edit Channel' : 'Create Channel'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Channel Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 p-2 w-full border rounded-md border-gray-300"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Channel Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-2 p-2 w-full border rounded-md border-gray-300"
                  rows="4"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Upload Avatar</label>
                <input
                  type="file"
                  id="avatar"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="mt-2 p-2 w-full border rounded-md border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {channel ? 'Update Channel' : 'Create Channel'}
                </button>

                {channel && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete Channel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChannelModal;
