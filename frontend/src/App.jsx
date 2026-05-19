import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./components/Home";
import Forgotpassword from "./components/Forgotpassword";
import { useSelector } from "react-redux";
import GetCurrentUser from "./hooks/GetCurrentUser";
import GetSuggestedUsers from "./hooks/Getsugesteduser";
import Aiimg from "./components/Aiimg";
import Profile from "./components/Profile";
import Editprofile from "./components/Editprofile";
import Upload from "./components/Upload";



export const ServerUrl = "http://localhost:5000";

function App() {
  GetCurrentUser();
  const { userdata, loading, authChecked } = useSelector((state) => state.user);

  if (loading && !authChecked) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
     
      {userdata && <GetSuggestedUsers />}
      
      <Routes>
        <Route 
          path="/" 
          element={userdata ? <Home /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/signup" 
          element={!userdata ? <Signup /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signin" 
          element={!userdata ? <Signin /> : <Navigate to="/" />} 
        />
        <Route 
          path="/forgotpassword" 
          element={!userdata ? <Forgotpassword /> : <Navigate to="/" />} 
        />
      <Route path="/ai" element={<Aiimg/>}/>
      <Route path="/upload" element={<Upload/>}/>
      <Route path="/profile/:username" element={<Profile/>}/>
      <Route path="/editprofile" element={<Editprofile/>}/>
      </Routes>
    </>
  );
}

export default App;