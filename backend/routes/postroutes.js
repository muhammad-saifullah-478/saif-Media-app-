const express=require('express')
const postroute=express.Router()
const isauth = require('../middleware/isauth')
const upload = require('../middleware/multer')
const { uploadpost, getallposts, like, comments, saved } = require('../controller/postcontroller')

postroute.post('/upload',isauth,upload.single('media'),uploadpost)
postroute.get('/getallpost',isauth,getallposts)
postroute.get('/like/:postid',isauth,like)
postroute.post('/comment',isauth,comments) // POST method hi rahega
postroute.get('/saved/:postid',isauth,saved)

module.exports=postroute