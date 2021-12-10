const mongoose=require('mongoose')
const DB=process.env.DB_URL

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
}).then(()=>{
    console.log("connection is successful!!!");
}).catch((e)=>{
    console.log(e);
})