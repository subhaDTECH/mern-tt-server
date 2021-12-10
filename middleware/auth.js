const Student=require('../modules/studentSchema')
const jwt=require("jsonwebtoken")
const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        console.log('tokkken----->',token);
        const verifyuser=jwt.verify(token,process.env.SECRET_KEY);
        console.log("veryfi user------>",verifyuser);
        const rootUser= await  Student.findOne({_id:verifyuser._id,"tokens.token":token});
        console.log("rootuser----->",rootUser);
        if(!rootUser){
            throw new Error("User not found");
        }
        req.token=token;
        req.rootUser=rootUser;
        req.UserId=rootUser._id;
        next();

    }catch(e){
        res.status(401).send("unauthorize")
        console.log(e);
    }

}
module.exports=auth;