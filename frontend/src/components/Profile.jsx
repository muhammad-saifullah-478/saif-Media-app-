import axios from "axios";
import React, { useEffect, useState } from "react";
import { ServerUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setprofiledata } from "../redux/userslice";
import Lefthome from "./Lefthome";
import { ArrowLeft } from "lucide-react"; 
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profiledata, userdata } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const editprofile = () => {
    navigate('/editprofile');
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultImg = "https://cdn-icons-png.flaticon.com/128/1144/1144760.png";

  // 🔹 Fetch Profile Function
  const handleProfile = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${ServerUrl}/api/getprofile/${username}`,
        { withCredentials: true }
      );

      if (result.data.user) {
        dispatch(setprofiledata(result.data.user));
      } else {
        dispatch(setprofiledata(result.data));
      }

      setError(null);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      handleProfile();
    }
  }, [username]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );

  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-1/5 border-r border-gray-200 p-4">
        <Lefthome className="no-scrollbar" />
      </div>

      {/* Main Profile Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 flex justify-center items-start p-6">
          <div className="w-full max-w-2xl">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center gap-4">
              <img
                src={profiledata?.profileimg || defaultImg}
                alt={profiledata?.username}
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
              />
              <div>
                <h2 className="text-xl font-semibold">{profiledata?.name}</h2>
                <p className="text-sm text-gray-500">
                  {profiledata?.profession || "Add your profession here"}
                </p>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  {profiledata?.bio ||
                    "Your bio is still empty, add something about yourself!"}
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-6 flex items-center justify-around text-center">
              <div>
                <p className="text-lg font-bold">{profiledata?.posts?.length || 0}</p>
                <p className="text-gray-500 text-sm">Posts</p>
              </div>

              <div>
                <p className="text-lg font-bold">
                  {profiledata?.followers?.length || 0}
                </p>
                <p className="text-gray-500 text-sm">Followers</p>
                <div className="flex justify-center mt-2">
                  {profiledata?.followers?.slice(0, 5).map((follower, index) => (
                    <img
                      key={index}
                      src={follower?.profileimg || defaultImg}
                      alt="follower"
                      className="w-10 h-10 rounded-full border border-gray-200 -ml-2 hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-lg font-bold">
                  {profiledata?.following?.length || 0}
                </p>
                <p className="text-gray-500 text-sm">Following</p>
                <div className="flex justify-center mt-2">
                  {profiledata?.following?.slice(0, 5).map((follow, index) => (
                    <img
                      key={index}
                      src={follow?.profileimg || defaultImg}
                      alt="following"
                      className="w-10 h-10 rounded-full border border-gray-200 -ml-2 hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center">
              {profiledata?._id === userdata._id ? (
                // 🔹 Edit Profile Button
                <button 
                  onClick={editprofile} 
                  className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition duration-200"
                >
                  Edit Profile
                </button>
              ) : (
                // 🔹 Follow + Message Buttons
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium transition duration-200">
                    Follow
                  </button>
                  <button className="px-6 py-2 rounded-full bg-gray-300 hover:text-white hover:bg-gray-400 text-gray-700 font-medium transition duration-200">
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - positioned at bottom of main content */}
        <div className="w-full mt-auto">
          <Footer />
        </div>

        {/* Mobile Back Button */}
        <div className="sm:hidden fixed bottom-14 left-1 z-50 ">
          <Link
            to="/"
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg transition duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
      </div>

     
    </div>
  );
}