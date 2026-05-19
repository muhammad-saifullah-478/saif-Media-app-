const uploadoncloudinary = require("../config/cloudinary");
const Story = require("../models/storymodel");
const Users = require("../models/usermodels");

const uploadstory = async (req, res) => {
    try {
        const user = await Users.findById(req.userid);
        const { mediatype } = req.body;
        
        // Delete existing story if any
        if (user.story) {
            await Story.findByIdAndDelete(user.story);
            user.story = null;
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Media is required!' });
        }

        // Upload to Cloudinary
        const media = await uploadoncloudinary(req.file.buffer, {
            resource_type: mediatype === "video" ? "video" : "image",
            folder: "sirajbook/stories"
        });

        const story = await Story.create({
            author: req.userid,
            mediatype,
            media: media.secure_url
        });

        user.story = story._id;
        await user.save();

        const populatestory = await Story.findById(story._id)
            .populate("author", "name username profileimg")
            .populate("viewers", "name username profileimg");

        return res.status(201).json(populatestory);
    } catch (error) {
        console.error("Upload story error:", error);
        return res.status(500).json({ message: "Upload story error" });
    }
};

const viewstory = async (req, res) => {
    try {
        const storyid = req.params.storyid;
        const story = await Story.findById(storyid);
        
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        const alreadyViewed = story.viewers.some(viewer => viewer.toString() === req.userid.toString());
        if (!alreadyViewed) {
            story.viewers.push(req.userid);
            await story.save();
        }

        const populatestory = await Story.findById(storyid)
            .populate("author", "name username profileimg")
            .populate("viewers", "name username profileimg");

        return res.status(200).json(populatestory);
    } catch (error) {
        console.error("View story error:", error);
        return res.status(500).json({ message: "View story error" });
    }
};

const getstoryusername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await Users.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const stories = await Story.find({ author: user._id })
            .populate("author", "name username profileimg")
            .populate("viewers", "name username profileimg");

        return res.status(200).json(stories);
    } catch (error) {
        console.error("Get story by username error:", error);
        return res.status(500).json({ message: 'Get story by username error' });
    }
};

module.exports = { uploadstory, viewstory, getstoryusername };