const uploadoncloudinary = require("../config/cloudinary");
const Users = require("../models/usermodels");

const editprofilepage = async (req, res) => {
    try {
      
        console.log("Request file:", req.file);
        
        const { name, username, bio, gender, profession } = req.body;
        const userid = req.userid;
        
        // Check if username already exists (excluding current user)
        if (username) {
            const existingUser = await Users.findOne({ 
                username, 
                _id: { $ne: userid } 
            });
            if (existingUser) {
                return res.status(400).json({ message: "Username already taken!" });
            }
        }
        const updateData = {
            ...(name && { name }),
            ...(username && { username }),
            ...(bio && { bio }),
            ...(profession && { profession }),
            ...(gender && { gender })
        };

        // Handle profile image upload if file exists
        if (req.file) {
            try {
                // For memory storage
                const result = await uploadoncloudinary(req.file.buffer, {
                    resource_type: "image",
                    folder: "sirajbook/profiles"
                });
                
                // For disk storage:
                // const result = await uploadoncloudinary(req.file.path);
                
                updateData.profileimg = result.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload failed:", uploadError);
                return res.status(500).json({ message: "Profile image upload failed" });
            }
        }

        const user = await Users.findByIdAndUpdate(
            userid,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
        
    } catch (error) {
        console.error("Edit profile error:", error);
        return res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
}

const getcurrectuser = async (req, res) => {
    try {
        const userid = req.userid;
        const user = await Users.findById(userid).populate("posts reels")
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const suggestuser = async (req, res) => {
    try {
        const currentUserId = req.userid;
        
        const users = await Users.find({
            _id: { $ne: currentUserId }
        })
        .select('-password')
        .lean();

        return res.status(200).json(users);
    } catch (error) {
        console.error("Suggested users error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const getprofile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await Users.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Getprofile error:", error);
        return res.status(500).json({ message: "Getprofile error" });
    }
};

module.exports = { getcurrectuser, suggestuser, editprofilepage, getprofile };