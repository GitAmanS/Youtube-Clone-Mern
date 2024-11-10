import React from 'react';

const CreateChannel = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Create Your Channel</h2>
      <input type="text" placeholder="Channel Name" className="border border-gray-300 p-2 mb-2 w-full" />
      <button className="bg-blue-500 px-4 py-2 text-white">Create</button>
    </div>
  );
};

export default CreateChannel;
