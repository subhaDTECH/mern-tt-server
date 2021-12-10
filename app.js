const mongoose=require('mongoose')
const express=require('express')
const app=express()
const cookieParser=require("cookie-parser")
const port=process.env.PORT || 5000
require('dotenv').config()
//create connection 
const conn=require('./db/conn')

// const Student=require('./modules/studentSchema')
//middleware 
app.use(express.json())
app.use(cookieParser())
app.use(require('./routers/auth'))




app.listen(port,()=>{
    console.log("server run on port 5000")
})