const express = require("express");



const isauth = require("../middleware/isauth");
const upload = require("../middleware/multer");
const { uploadstory, getstoryusername, viewstory } = require("../controller/storycontroler");


const storyrouter = express.Router();

// story routes
storyrouter.post("/story", isauth, upload.single("media"), uploadstory);
storyrouter.get("/getstoryusername/:username", isauth, getstoryusername);
storyrouter.put("/view/:storyid", isauth,viewstory);

module.exports = storyrouter; 
