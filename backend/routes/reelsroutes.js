const express = require("express");


const upload = require("../middleware/multer");
const isauth = require("../middleware/isauth");
const { uploadreels, likeReel, commentReel, getallreels } = require("../controller/reelscontroler");


const reelsrouter = express.Router();

reelsrouter.post("/reels", isauth, upload.single("media"), uploadreels);

reelsrouter.put("/:id/like", isauth, likeReel);
reelsrouter.put("/allreels", isauth, getallreels);

reelsrouter.post("/:id/comment",isauth, commentReel);

module.exports = reelsrouter;
