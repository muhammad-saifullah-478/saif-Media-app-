import React, { useRef, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react"; // Added Loader2 icon
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { useDispatch, useSelector } from "react-redux";
import Lefthome from "./Lefthome";
import axios from "axios";
import { ServerUrl } from "../App";
import { setprofiledata, setuserdata } from "../redux/userslice";

export default function Editprofile() {
    const { userdata } = useSelector((state) => state.user);
    const imgref = useRef();
    const navigate = useNavigate(); // Added for navigation
    const [frontendimg, setfrontendimg] = useState(userdata?.profileimg || "https://cdn-icons-png.flaticon.com/128/1144/1144760.png");
    const [backend, setbackend] = useState(null);
    const [name, setname] = useState(userdata?.name || "");
    const [username, setusername] = useState(userdata?.username || "");
    const [bio, setbio] = useState(userdata?.bio || "");
    const [profession, setprofession] = useState(userdata?.profession || "");
    const [gender, setgender] = useState(userdata?.gender || "");
    const [loading, setLoading] = useState(false); // Added loading state
    const dispatch = useDispatch();

    const handleimg = (e) => {
        const file = e.target.files[0];
        if (file) {
            setbackend(file);
            setfrontendimg(URL.createObjectURL(file));
        }
    }

// Editprofile.js - Fixed version
const Hendeleditprofile = async (e) => {
    try {
        e.preventDefault();
        setLoading(true);
        
        const formdata = new FormData();
        formdata.append('name', name);
        formdata.append('username', username);
        formdata.append('bio', bio);
        formdata.append('gender', gender);
        formdata.append('profession', profession);
        
        // Use correct field name - 'profileimg'
        if (backend) {
            formdata.append("profileimg", backend);
        }
        
        const result = await axios.post(`${ServerUrl}/api/editprofile`, formdata, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (result.data) {
            dispatch(setprofiledata(result.data));
            dispatch(setuserdata(result.data));
            navigate(`/profile/${result.data.username}`);
        }
        
    } catch (error) {
        console.log("Edit profile error:", error);
        if (error.response && error.response.data) {
            alert(error.response.data.message || "Profile update failed!");
        } else if (error.request) {
            alert("Network error! Please check your connection.");
        } else {
            alert("Profile update failed!");
        }
    } finally {
        setLoading(false);
    }
}

    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                {/* Left Sidebar */}
                <div className="hidden lg:flex w-1/5 border-r border-gray-200 p-4">
                    <Lefthome className="no-scrollbar" />
                </div>

                <div className="min-h-screen flex flex-col items-center px-4 py-6 flex-1">
                    <div className="flex flex-col items-center text-center gap-3">
                        <img
                            onClick={() => imgref.current.click()}
                            src={frontendimg}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm cursor-pointer"
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            hidden 
                            onChange={handleimg} 
                            ref={imgref} 
                        />
                        <button 
                            className="text-blue-500 cursor-pointer text-sm font-medium"
                            onClick={() => imgref.current.click()}
                            type="button"
                            disabled={loading} // Disable when loading
                        >
                            Change Profile Picture
                        </button>
                    </div>

                    <form className="mt-6 w-full max-w-2xl space-y-4" onSubmit={Hendeleditprofile}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <input
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                type="text"
                                placeholder="Enter your name"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                disabled={loading} // Disable when loading
                            />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setusername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                disabled={loading} // Disable when loading
                            />
                            <input
                                type="text"
                                value={profession}
                                onChange={(e) => setprofession(e.target.value)}
                                placeholder="Enter your profession"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                disabled={loading} // Disable when loading
                            />
                            <select 
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                value={gender}
                                onChange={(e) => setgender(e.target.value)}
                                disabled={loading} // Disable when loading
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <textarea
                            value={bio}
                            onChange={(e) => setbio(e.target.value)}
                            placeholder="Enter your bio"
                            rows="5"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            disabled={loading} // Disable when loading
                        ></textarea>

                        <button
                            type="submit"
                            disabled={loading} // Disable when loading
                            className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md shadow-sm transition duration-300 text-sm font-medium flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </form>
                </div>

              
                <div className="sm:hidden fixed bottom-4 left-4 z-50">
                    <Link
                        to="/"
                        className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-full shadow-lg transition duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </>
    );
}