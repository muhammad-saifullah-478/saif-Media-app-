import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { ToastContainer, toast } from "react-toastify";

const StoryViewer = () => {
  const { userdata } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchAllStories();
  }, []);

  useEffect(() => {
    let interval;
    if (showViewer && stories.length > 0) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [showViewer, currentStoryIndex, currentUserIndex]);

  const fetchAllStories = async () => {
    try {
      const response = await axios.get(`${ServerUrl}/api/getallstories`, {
        withCredentials: true,
      });
      setStories(response.data.stories || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const openStoryViewer = (userIndex = 0, storyIndex = 0) => {
    setCurrentUserIndex(userIndex);
    setCurrentStoryIndex(storyIndex);
    setShowViewer(true);
    setProgress(0);
    markStoryAsViewed(stories[userIndex]?._id);
  };

  const handleNextStory = () => {
    const currentUserStories = stories.filter(
      story => story.author._id === stories[currentUserIndex]?.author._id
    );

    if (currentStoryIndex < currentUserStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      setShowViewer(false);
    }
    setProgress(0);
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      const prevUserStories = stories.filter(
        story => story.author._id === stories[prev - 1]?.author._id
      );
      setCurrentStoryIndex(prevUserStories.length - 1);
    }
    setProgress(0);
  };

  const markStoryAsViewed = async (storyId) => {
    try {
      await axios.put(`${ServerUrl}/api/view/${storyId}`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error marking story as viewed:", error);
    }
  };

  const handleUploadStory = async (file, mediatype) => {
    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("mediatype", mediatype);

      const response = await axios.post(`${ServerUrl}/api/story`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Story uploaded successfully!");
        fetchAllStories();
      }
    } catch (error) {
      console.error("Error uploading story:", error);
      toast.error("Failed to upload story");
    }
  };

  const groupedStories = stories.reduce((acc, story) => {
    const authorId = story.author._id;
    if (!acc[authorId]) {
      acc[authorId] = [];
    }
    acc[authorId].push(story);
    return acc;
  }, {});

  const currentStories = groupedStories[stories[currentUserIndex]?.author._id] || [];
  const currentStory = currentStories[currentStoryIndex];

  return (
    <div className="w-full">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Stories Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex space-x-4 overflow-x-auto pb-2 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Your Story */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="relative">
              <div 
                className="w-16 h-16 rounded-full border-2 border-white bg-gradient-to-r from-purple-400 to-pink-500 p-0.5 cursor-pointer"
                onClick={() => document.getElementById('storyUpload').click()}
              >
                <img
                  src={userdata?.profileimg || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                  alt="Your story"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
                <div className="absolute -bottom-1 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <input
                id="storyUpload"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const mediatype = file.type.startsWith('video/') ? 'video' : 'image';
                    handleUploadStory(file, mediatype);
                  }
                }}
              />
            </div>
            <span className="text-xs text-gray-600 font-medium">Your story</span>
          </div>

          {/* Other Stories */}
          {Object.entries(groupedStories).map(([authorId, userStories], index) => {
            const story = userStories[0];
            const hasUnviewed = userStories.some(s => 
              !s.viewers.some(viewer => viewer._id === userdata?._id)
            );

            return (
              <div key={authorId} className="flex flex-col items-center space-y-2 flex-shrink-0">
                <div className="relative">
                  <div 
                    className={`w-16 h-16 rounded-full p-0.5 cursor-pointer ${
                      hasUnviewed 
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                    onClick={() => openStoryViewer(index, 0)}
                  >
                    <img
                      src={story.author.profileimg}
                      alt={story.author.username}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-600 max-w-[60px] truncate">
                  {story.author.username}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {showViewer && currentStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
            {currentStories.map((_, index) => (
              <div key={index} className="h-1 bg-gray-600 rounded-full flex-1">
                <div 
                  className={`h-full rounded-full ${
                    index === currentStoryIndex 
                      ? 'bg-white' 
                      : index < currentStoryIndex 
                        ? 'bg-white' 
                        : 'bg-gray-600'
                  }`}
                  style={{
                    width: index === currentStoryIndex ? `${progress}%` : 
                           index < currentStoryIndex ? '100%' : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button 
            onClick={() => setShowViewer(false)}
            className="absolute top-4 right-4 text-white z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Story Content */}
          <div className="w-full h-full flex items-center justify-center">
            {currentStory.mediatype === "image" ? (
              <img
                src={currentStory.media}
                alt="Story"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={currentStory.media}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={handlePrevStory}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10"
          >
            ‹
          </button>
          <button 
            onClick={handleNextStory}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10"
          >
            ›
          </button>

          {/* Story Info */}
          <div className="absolute bottom-4 left-4 text-white z-10">
            <p className="font-semibold">{currentStory.author.username}</p>
            <p className="text-sm">
              {currentStory.viewers.length} views • {formatTime(currentStory.createdAt)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes}m ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
  }
};

export default StoryViewer;