const mongoose=require('mongoose')

const storyscehma=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    mediatype:{
    type:String,
    enum:['image','video'],
    required:true
},
media:{
    type:String,
    required:true
},
viewers:[
    {  type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    }
],
createdat:{
    type:Date,
    default:Date.now(),
    expires:86400
}

},{timestamps:true})

const Story=mongoose.model('Story',storyscehma)
module.exports=Story