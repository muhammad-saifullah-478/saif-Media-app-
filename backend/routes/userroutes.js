const express=require('express')
const { getcurrectuser, suggestuser, editprofilepage, getprofile } = require('../controller/usercontroler')
const isauth = require('../middleware/isauth')
const multer = require('multer')
const upload = require('../middleware/multer')
const userrouter=express.Router()

userrouter.get('/user/currentuser', isauth, getcurrectuser) 
userrouter.get('/getprofile/:username',isauth,getprofile)
userrouter.get("/suggestedusers", isauth, suggestuser);
userrouter.post('/editprofile',isauth,upload.single('profileimg'),editprofilepage)

module.exports=userrouter