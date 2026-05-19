import React from "react";
import { FiHome, FiSearch, FiPlusSquare, FiFilm, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BottomNav() {
  const { userdata } = useSelector((state) => state.user);
  
  const defaultImg = "https://cdn-icons-png.flaticon.com/128/1144/1144760.png";

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md flex justify-around items-center py-2 z-50">
      <Link to={'/'}> 
        <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
          <FiHome className="text-2xl" />
          <span className="text-xs">Home</span>
        </button>
      </Link>
      
      <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
        <FiSearch className="text-2xl" />
        <span className="text-xs">Search</span>
      </button>
      <Link to={'/upload'}> 
      <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
        <FiPlusSquare className="text-2xl" />
        <span className="text-xs">Upload</span>
      </button>
      </Link>
      
      <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
        <FiFilm className="text-2xl" />
        <span className="text-xs">Reels</span>
      </button>
      
      <Link to={`/profile/${userdata?.username}`}>
        <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
          <img 
            src={userdata?.profileimg || defaultImg}
            alt="Profile"
            className="w-6 h-6 rounded-full object-cover border border-gray-300"
          />
          <span className="text-xs">Profile</span>
        </button>
      </Link>
    </div>
  );
}