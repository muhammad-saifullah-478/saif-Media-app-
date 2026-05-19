const express=require('express')
const dbconnect = require('./config/db')
const app=express()
const cookie_parser=require('cookie-parser')
const authroute = require('./routes/authroutes')
const cors=require('cors')
const userrouter = require('./routes/userroutes')
const postroute = require('./routes/postroutes')
const reelsrouter = require('./routes/reelsroutes')
const storyrouter = require('./routes/storyroutes')
require('dotenv').config()

let PORT=process.env.PORT || 4000
dbconnect()

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json())
app.use(cookie_parser())
app.use(express.urlencoded({ extended: true }));
app.use('/api',authroute)
app.use('/api',userrouter)
app.use('/api',postroute)
app.use('/api',reelsrouter)
app.use('/api',storyrouter)

app.get('/',(req,res)=>{
    res.send('okkk')
})


app.listen(PORT,()=>{
console.log(`your server was run on ${PORT}`)
})