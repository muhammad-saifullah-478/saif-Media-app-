const mongoose =require('mongoose')

const userschema=new mongoose.Schema({
name:{
type:String,
required:true
},
username:{
type:String,
required:true,
unique:true
},
email:{
type:String,
required:true,
unique:true
},
password:{
type:String,
required:true
},
profileimg:{
    type:String,
},
bio:{
 type:String,
},
profession:{
 type:String,
},
gender:{
    type:String,
    enum:['male','female','others'],
    default:'male'
},
followers:[
    {type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }   
],
follwing:[
    {type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }   
],
posts:[
  {type:mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    }   
],
savedposts:[
    {type:mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    } 
],

reels:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Reels'
    } 
],

story:{
 type:mongoose.Schema.Types.ObjectId,
        ref:'Story'
},
 resetotp: {
    type: String
  },
otpexpire:{
    type:Date
},
otpverify:{
    type:Boolean,
    default:false
}

},{timestamps:true})


const Users=mongoose.model('Users',userschema)
module.exports=Users