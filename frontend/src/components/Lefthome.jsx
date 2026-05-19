import React from "react";
import { CiHeart } from "react-icons/ci";
import { FiHome, FiSearch, FiPlusSquare, FiFilm, FiUser } from "react-icons/fi";
import { FiBell } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Lefthome() {
  return (
    <div className="w-[20%] hidden lg:flex flex-col min-h-screen bg-white border-r border-gray-200 p-6 shadow-md fixed left-0 top-0 bottom-0 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="fnt text-2xl font-extrabold text-gray-800 tracking-wide">
          SAIFULLAH<span className="text-blue-500"></span>
        </h1>
        <CiHeart className="text-3xl text-gray-700 hover:text-red-500 transition-colors duration-300 cursor-pointer" />
      </div>
      
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <Link to={'/'}> 
            <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200">      
              <FiHome className="text-xl text-gray-700" />
              <span className="text-lg text-gray-800 font-medium">Home</span>
            </li>
          </Link>
          
          <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200">
            <FiSearch className="text-xl text-gray-700" />
            <span className="text-lg text-gray-800 font-medium">Search</span>
          </li>
          
          <Link to={'/upload'}> 
            <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200">
              <FiPlusSquare className="text-xl text-gray-700" />
              <span className="text-lg text-gray-800 font-medium">Upload</span>
            </li>
          </Link>
          
          <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200">
            <FiFilm className="text-xl text-gray-700" />
            <span className="text-lg text-gray-800 font-medium">Reels</span>
          </li>
          
          <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200">
            <FiBell className="text-xl text-gray-700" />
            <span className="text-lg text-gray-800 font-medium">Notifications</span>
          </li>
          
          <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200">
            <FiMessageCircle className="text-xl text-gray-700" />
            <span className="text-lg text-gray-800 font-medium">Messages</span>
          </li>
        </ul>
      </nav>
     
      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
        © {new Date().getFullYear()} saifullah
      </div>
    </div>
  );
}