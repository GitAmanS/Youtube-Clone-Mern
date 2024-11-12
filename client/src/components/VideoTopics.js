import React, { useState } from 'react';

const VideoTopics = () => {
  const [selectedTopic, setSelectedTopic] = useState("All");

  const topics = [
    "All", "Macintosh", "Display devices", "Gaming", "Rockets", "Caving", "Music", 
    "Military aircraft", "Live", "Mixes", "Android", "Underwater diving", "News", 
    "Armoured fighting vehicle", "Application software", "Navy", "History", "Experiments"
  ];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="fixed z-30 bg-[#0F0F0F] pt-12 pb-2  w-screen">
      <div className="overflow-x-auto ml-16 whitespace-nowrap hide-scrollbar">
        <div className="flex space-x-2">
          {topics.map((topic) => (
            <button
              key={topic}
              className={`px-2 py-1 text-sm rounded-lg ${
                selectedTopic === topic 
                  ? 'bg-white text-[#272727] font-semibold' 
                  : 'bg-[#272727] text-white'
              } transition-colors duration-200`}
              role="tab"
              aria-selected={selectedTopic === topic}
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoTopics;
