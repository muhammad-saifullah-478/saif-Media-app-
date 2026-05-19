import React, { useState, useEffect } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaHeart, FaBookmark, FaImages, FaRegComment, FaRegSmile } from "react-icons/fa";
import { LuMessageCircleHeart } from "react-icons/lu";
import { TbMessageChatbot } from "react-icons/tb";
import { IoIosSend, IoIosClose } from "react-icons/io";
import { MdMoreHoriz } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import BottomNav from "./BottomNav";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

export default function CenterHome() {
  const { userdata } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [expandedCaptions, setExpandedCaptions] = useState({});

  // Initial data fetch
  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, []);

  // Initialize liked and saved posts from fetched data
  useEffect(() => {
    if (posts.length > 0 && userdata) {
      const initialLiked = new Set();
      const initialSaved = new Set();
      
      posts.forEach(post => {
        if (post.likes.includes(userdata._id)) {
          initialLiked.add(post._id);
        }
      });
      
      setLikedPosts(initialLiked);
    }
  }, [posts, userdata]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${ServerUrl}/api/getallpost`, {
        withCredentials: true,
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const mockStories = [
        {
          id: 1,
          username: "siraj_tech",
          profileImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          isLive: true,
          author: { _id: "1" }
        },
        {
          id: 2,
          username: "travel_diaries",
          profileImg: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          isLive: false,
          author: { _id: "2" }
        },
        {
          id: 3,
          username: "food_lover",
          profileImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
          isLive: true,
          author: { _id: "3" }
        },
      ];
      setStories(mockStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  // Like/Unlike post - Optimistic Update
  const handleLike = async (postId) => {
    const originalPosts = [...posts];
    const wasLiked = likedPosts.has(postId);

    try {
      // Optimistic update
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: wasLiked
                  ? post.likes.filter(id => id !== userdata?._id)
                  : [...post.likes, userdata?._id],
              }
            : post
        )
      );

      // Update liked posts set
      if (wasLiked) {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        setLikedPosts(prev => new Set(prev).add(postId));
      }

      // API call
      await axios.get(`${ServerUrl}/api/like/${postId}`, {
        withCredentials: true,
      });

      toast.success(wasLiked ? "Post unliked" : "Post liked");

    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
      
      // Revert optimistic update
      setPosts(originalPosts);
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
    }
  };

  // Save/Unsave post
  const handleSave = async (postId) => {
    const wasSaved = savedPosts.has(postId);

    try {
      // Optimistic update
      if (wasSaved) {
        setSavedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        setSavedPosts(prev => new Set(prev).add(postId));
      }

      // API call
      await axios.get(`${ServerUrl}/api/saved/${postId}`, {
        withCredentials: true,
      });

      toast.success(wasSaved ? "Post removed from saved" : "Post saved");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
      
      // Revert optimistic update
      setSavedPosts(prev => {
        const newSet = new Set(prev);
        if (wasSaved) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
    }
  };

  // Add comment - Fixed version
  const handleAddComment = async (postId) => {
    const comment = commentTexts[postId];
    if (!comment?.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      // Optimistic update
      const newComment = {
        author: userdata,
        message: comment,
        createdAt: new Date().toISOString(),
        _id: `temp-${Date.now()}`
      };

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, newComment],
              }
            : post
        )
      );

      // Clear comment input
      setCommentTexts(prev => ({ ...prev, [postId]: "" }));

      // API call - Fixed parameters
      await axios.post(
        `${ServerUrl}/api/comment`,
        {
          postId: postId,
          message: comment,
        },
        { withCredentials: true }
      );

      // Refresh posts to get actual data from server
      await fetchPosts();
      
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      
      // Revert optimistic update on error
      await fetchPosts();
    }
  };

  // Handle comment text change
  const handleCommentChange = (postId, text) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: text,
    }));
  };

  // Toggle comments expansion
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Toggle caption expansion
  const toggleCaption = (postId) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Open comments modal
  const openCommentsModal = (post) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
  };

  // Close comments modal
  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedPost(null);
  };

  // Navigate to user profile
  const handleUserProfileClick = (username) => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  // Navigate to comment author profile
  const handleCommentUserClick = (username, e) => {
    e.stopPropagation();
    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    
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

  // Check if text needs "See More"
  const needsSeeMore = (text, maxLength = 100) => {
    return text && text.length > maxLength;
  };

  // Truncate text for preview
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Navigation handlers
  const handleAIClick = () => {
    navigate("/ai");
  };

  const handleGenerateImage = () => {
    navigate("/ai");
  };

  const handleMessages = () => {
    toast.info("Messages feature coming soon!");
  };

  if (loading) {
    return (
      <div className="w-full lg:w-[55%] min-h-screen bg-white lg:ml-[20%] lg:mr-[25%] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[55%] min-h-screen bg-white lg:ml-[20%] lg:mr-[25%] overflow-y-auto">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Mobile Header - Fixed Position */}
      <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
        <h1 className="fnt text-2xl font-extrabold text-gray-800 tracking-wide">
          saif<span className="text-blue-500">Book</span>
        </h1>
        <CiHeart className="text-3xl text-gray-700 hover:text-red-500 transition-colors duration-300 cursor-pointer" />
      </div>

      {/* Content with padding for mobile header */}
      <div className="pt-16 lg:pt-0">
        
        {/* Stories Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-4 overflow-x-auto pb-2 
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* Your Story */}
            <div className="flex flex-col items-center space-y-2 flex-shrink-0">
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-full border-2 border-white bg-gradient-to-r from-purple-400 to-pink-500 p-0.5 cursor-pointer"
                  onClick={() => handleUserProfileClick(userdata?.username)}
                >
                  <img
                    src={userdata?.profileimg || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                    alt="Your story"
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                <div className="absolute -bottom-1 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">Your story</span>
            </div>

            {/* Other Stories */}
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
                <div className="relative">
                  <div 
                    className={`w-16 h-16 rounded-full p-0.5 cursor-pointer ${
                      story.isLive 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                        : 'bg-gradient-to-r from-purple-400 to-pink-500'
                    }`}
                    onClick={() => handleUserProfileClick(story.username)}
                  >
                    <img
                      src={story.profileImg}
                      alt={story.username}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  {story.isLive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[8px] px-1 rounded-full border border-white">
                      LIVE
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 max-w-[60px] truncate">{story.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Section */}
        <div className="pb-20">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CiHeart className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Be the first to share something amazing!
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                Create First Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white border-b border-gray-200">
                {/* Post Header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 p-0.5 cursor-pointer"
                      onClick={() => handleUserProfileClick(post.author?.username)}
                    >
                      <img
                        src={post.author?.profileimg || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                        alt={post.author?.username}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                    </div>
                    <div>
                      <p 
                        className="text-sm font-semibold cursor-pointer hover:text-blue-500 transition-colors"
                        onClick={() => handleUserProfileClick(post.author?.username)}
                      >
                        {post.author?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MdMoreHoriz className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Media - Reduced Height */}
                <div className="w-full max-h-96 bg-gray-100 overflow-hidden">
                  {post.mediatype === "image" ? (
                    <img
                      src={post.media}
                      alt="Post"
                      className="w-full h-full object-contain max-h-96"
                    />
                  ) : (
                    <video
                      src={post.media}
                      controls
                      className="w-full h-full object-contain max-h-96"
                    />
                  )}
                </div>

                {/* Post Actions */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLike(post._id)}
                        className={`hover:scale-110 transition-transform duration-200 ${
                          likedPosts.has(post._id) || post.likes.includes(userdata?._id)
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                      >
                        {likedPosts.has(post._id) || post.likes.includes(userdata?._id) ? (
                          <FaHeart className="w-6 h-6" />
                        ) : (
                          <CiHeart className="w-6 h-6" />
                        )}
                      </button>
                      <button 
                        onClick={() => openCommentsModal(post)}
                        className="text-gray-700 hover:text-blue-500 hover:scale-110 transition-transform duration-200"
                      >
                        <FaRegComment className="w-5 h-5" />
                      </button>
                      <button className="text-gray-700 hover:text-green-500 hover:scale-110 transition-transform duration-200">
                        <IoIosSend className="w-6 h-6" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleSave(post._id)}
                      className={`hover:scale-110 transition-transform duration-200 ${
                        savedPosts.has(post._id) ? "text-yellow-500" : "text-gray-700"
                      }`}
                    >
                      {savedPosts.has(post._id) ? (
                        <FaBookmark className="w-6 h-6" />
                      ) : (
                        <CiBookmark className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  {/* Likes Count - Clear Styling */}
                  {post.likes.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                      </p>
                    </div>
                  )}

                  {/* Comments Count Summary */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mb-2">
                      <button 
                        onClick={() => openCommentsModal(post)}
                        className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
                      >
                        View all {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                      </button>
                    </div>
                  )}
                  
                  {/* Caption with See More */}
                  {post.caption && (
                    <div className="text-sm mb-2">
                      <span 
                        className="font-semibold cursor-pointer hover:text-blue-500 transition-colors"
                        onClick={() => handleUserProfileClick(post.author?.username)}
                      >
                        {post.author?.username}
                      </span>
                      <span className="ml-2 text-gray-800">
                        {expandedCaptions[post._id] ? (
                          post.caption
                        ) : (
                          <>
                            {needsSeeMore(post.caption) ? (
                              <>
                                {truncateText(post.caption)}
                                <button
                                  onClick={() => toggleCaption(post._id)}
                                  className="text-gray-500 hover:text-gray-700 text-sm ml-1 font-medium"
                                >
                                  See More
                                </button>
                              </>
                            ) : (
                              post.caption
                            )}
                          </>
                        )}
                        {expandedCaptions[post._id] && needsSeeMore(post.caption) && (
                          <button
                            onClick={() => toggleCaption(post._id)}
                            className="text-gray-500 hover:text-gray-700 text-sm ml-1 font-medium"
                          >
                            See Less
                          </button>
                        )}
                      </span>
                    </div>
                  )}

                
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {post.comments.slice(0, 2).map((comment, index) => (
                        <div key={comment._id || index} className="text-sm break-words">
                        
                        
                        </div>
                      ))}
                      
                      
                    
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex items-center mt-3 border-t border-gray-200 pt-3">
                    <div className="flex items-center flex-1 bg-gray-100 rounded-full px-4 py-2 transition-all duration-300">
                      <FaRegSmile className="text-gray-500 text-lg mr-3 cursor-pointer hover:text-yellow-400 transition-colors duration-200" />
                      <input
                        type="text"
                        value={commentTexts[post._id] || ""}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 text-sm text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(post._id);
                          }
                        }}
                      />
                    </div>

                    {/* Post Button */}
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className={`ml-3 text-sm font-semibold transition-all duration-300 ${
                        commentTexts[post._id]?.trim()
                          ? "text-blue-500 hover:text-blue-600"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!commentTexts[post._id]?.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comments Modal */}
        {showCommentsModal && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Comments</h3>
                <button 
                  onClick={closeCommentsModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoIosClose className="w-6 h-6" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  <div className="space-y-4">
                    {selectedPost.comments.map((comment, index) => (
                      <div key={comment._id || index} className="flex items-start space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 p-0.5 flex-shrink-0 cursor-pointer"
                          onClick={() => handleUserProfileClick(comment.author?.username)}
                        >
                          <img
                            src={comment.author?.profileimg || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                            alt={comment.author?.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p 
                              className="font-semibold text-sm cursor-pointer hover:text-blue-500 transition-colors"
                              onClick={() => handleUserProfileClick(comment.author?.username)}
                            >
                              {comment.author?.username}
                            </p>
                            <p className="text-sm mt-1 text-gray-800 break-words">{comment.message}</p>
                          </div>
                         
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <FaRegComment className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No comments yet</p>
                    <p className="text-sm">Be the first to comment!</p>
                  </div>
                )}
              </div>

            
            </div>
          </div>
        )}

        {/* Floating Action Buttons - Only show on mobile */}
        <div className="lg:hidden fixed bottom-20 right-4 flex flex-col gap-3 z-40">
          {/* Message Button */}
          <button 
            onClick={handleMessages}
            className="group flex items-center justify-start bg-gradient-to-r from-purple-500 to-pink-500 text-white h-12 w-12 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 overflow-hidden hover:shadow-xl"
          >
            <LuMessageCircleHeart className="text-xl min-w-12 flex justify-center" />
            <span className="ml-2 font-medium text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300">
              Message
            </span>
          </button>

          {/* saif AI Button */}
          <button 
            onClick={handleAIClick}
            className="group flex items-center justify-start bg-gradient-to-r from-blue-500 to-cyan-500 text-white h-12 w-12 rounded-full shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 overflow-hidden hover:shadow-xl"
          >
            <TbMessageChatbot className="text-xl min-w-12 flex justify-center" />
            <span className="ml-2 font-medium text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300">
              saif AI
            </span>
          </button>

          {/* Generate Image Button */}
          <button 
            onClick={handleGenerateImage}
            className="group flex items-center justify-start bg-gradient-to-r from-green-500 to-emerald-500 text-white h-12 w-12 rounded-full shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 overflow-hidden hover:shadow-xl"
          >
            <FaImages className="text-xl min-w-12 flex justify-center" />
            <span className="ml-2 font-medium text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300">
              Generate Img
            </span>
          </button>
        </div>
      </div>

      <BottomNav />
      <Footer/>
    </div>
  );
}