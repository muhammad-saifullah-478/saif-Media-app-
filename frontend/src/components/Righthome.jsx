import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, Users, ChevronRight, X } from "lucide-react";
import { logout } from "../redux/userslice";
import axios from "axios";
import { ServerUrl } from "../App";
import { LuMessageCircleHeart } from "react-icons/lu";
import { TbMessageChatbot } from "react-icons/tb";
import { FaImages } from "react-icons/fa";
import Aiimg from "./Aiimg"; 
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";

export default function Righthome() {
  const { userdata, suggestedUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAiImage, setShowAiImage] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/signout`, { 
        withCredentials: true 
      });
      dispatch(logout());
      setShowLogoutModal(false);
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      setShowLogoutModal(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleFollow = async (userId) => {
    try {
      console.log("Follow user:", userId);
      // Implement follow functionality here
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const handleSirajAIClick = () => {
    setShowAiImage(true);
  };

  const handleCloseAiImage = () => {
    setShowAiImage(false);
  };

  // Show only 3 users initially, or all if showAllUsers is true
  const displayedUsers = showAllUsers 
    ? suggestedUsers 
    : (suggestedUsers?.slice(0, 5) || []);

  return (
    <>
      {/* Blur overlay when AI image is open */}
      {showAiImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"></div>
      )}
      
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleCancelLogout}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-50">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <LogOut className="text-red-500" size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Logout
              </h3>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout from your account?
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={`w-[25%] hidden lg:flex flex-col min-h-screen bg-white border-l border-gray-200 fixed right-0 top-0 bottom-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] z-30 ${
        showAiImage || showLogoutModal ? 'blur-sm' : ''
      }`}>
        {/* Hide scrollbar for Chrome, Safari and Opera */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Fixed Header Section */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="cursor-pointer flex items-center gap-3" onClick={()=>navigate(`/profile/${userdata.username}`)}>
              <img
                src={userdata?.profileimg || "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-sm font-semibold text-gray-800 truncate">
                  {userdata?.username || "Guest User"}
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  {userdata?.email || "No Email"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="text-blue-500 text-xs font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Suggested Users Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-700">Suggested Users</h2>
              </div>
              
              {suggestedUsers && suggestedUsers.length > 3 && (
                <button
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
                >
                  {showAllUsers ? "Show Less" : "See All"}
                  <ChevronRight 
                    size={14} 
                    className={`transition-transform ${showAllUsers ? 'rotate-90' : ''}`}
                  />
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {displayedUsers && displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <div 
                    key={user._id} 
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    onClick={() => navigate(`/profile/${user.username}`)}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img
                        src={user.profileimg || "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-800 truncate">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.name || user.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleFollow(user._id);
                      }}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors flex-shrink-0 ml-2"
                    >
                      Follow
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500">No suggestions available</p>
                  <p className="text-xs text-gray-400 mt-1">Follow more people to get suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section */}
       <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
  <div className="flex flex-col items-center gap-3 w-full">
    {/* Message Button */}
    <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-5 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 w-full max-w-[200px] group hover:scale-105">
      <LuMessageCircleHeart className="text-lg group-hover:scale-110 transition-transform" />
      <span className="text-xs font-semibold">Message</span>
    </button>

    {/* saif AI Button */}
    <button 
      onClick={handleSirajAIClick}
      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-5 rounded-full shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 w-full max-w-[200px] group hover:scale-105"
    >
      <TbMessageChatbot className="text-lg mt-[2px] group-hover:scale-110 transition-transform" />
      <span className="text-xs font-semibold">Saif AI</span>
    </button>
  </div>
</div>
      </div>

      {/* AI Image Modal */}
      {showAiImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleCloseAiImage}
          ></div>
          
          <div className="relative bg-white max-w-[400px] rounded-2xl shadow-2xl w-full p-3 max-h-[94vh] overflow-hidden z-50">
            <div className="fnt flex justify-between mb-2">
              <div>saif<span className="text-blue-600">Book</span></div>
              <div> 
                <button 
                  onClick={handleCloseAiImage}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ImCross className="text-gray-600 hover:text-gray-800" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(500vh-200px)] max-w-[600px]">
              <Aiimg />
            </div>
          </div>
        </div>
      )}
    </>
  );
}