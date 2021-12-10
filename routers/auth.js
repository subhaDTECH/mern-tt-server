const express=require('express')
const router=express.Router()
const cookieParser=require('cookie-parser')
const Student=require('../modules/studentSchema')
const bcrypt=require('bcryptjs')
const auth=require('../middleware/auth');
const jwt=require("jsonwebtoken")
require('../db/conn')

router.get('/',(req,res)=>{
    res.send(req.rootUser)
})

router.get('/about',auth,(req,res)=>{
    res.send( req.rootUser);
})
router.get('/logout',(req,res)=>{
    console.log("logout from router")
    res.clearCookie('jwt',{path:"/"});
    res.status(200).send("User Logout");
})
router.get('/getUserData',auth,(req,res)=>{
    console.log('hello from getUserData');
    res.send(req.rootUser);

})
// router.post('/register',(req,res)=>{
//     const {name,email,phone,work,password,cpassword}=req.body;
//     if(!name||!email||! phone||! work ||! password|| !cpassword){
//         return res.status(422).json({error:"plz fill the data correctly"});
//     } 
//     Student.findOne({email:email})
//     .then((StudentExits)=>{
//         if(StudentExits){
//             return res.status(422).json({error:"User already exists"});

//         }
//         const StudentCreate=new Student({
//             name,email,phone,work,password,cpassword

//         })
//         StudentCreate.save().then(()=>{
//             res.status(201).json({message:"registation successfully !!"})
//         }).catch((e)=>{
//             res.status(500).json({error:"registation not successful!"})
//         })
//     }).then((e)=>{
//         console.log(e);
//     })
        

// })



router.post('/register',async(req,res)=>{
    const {name,email,phone,work,password,cpassword}=req.body;
    if(!name||!email||! phone||! work ||! password|| !cpassword){
        return res.status(422).json({error:"plz fill the data correctly"});
    } 
    if(password!=cpassword){
        return res.status(422).json({error:"password are not matching"});
    }

    try{
        
       const UserExists= await Student.findOne({email:email})
       if(UserExists){
        return res.status(422).json({error:"User already exists"});
       }
       const StudentCreate=new Student({name,email,phone,work,password,cpassword});
       //hash data before save using middeleware
            const userData= await StudentCreate.save()
            res.status(201).json({message:"registation successfully !!"})
            console.log(userData)

    }catch(e){
        res.status(500).json({error:"registation not successful!"})
        console.log(e)

    }
    


})

router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log("hii")
        if(!email || !password){
            return res.status(422).json({error:"plz fill it correctly"})
        }
        const UserExists= await Student.findOne({email:email})
        if(!UserExists){
            return res.status(422).json({error:"User not  exists/invalid email or password"});
        }
     const isMatch=await bcrypt.compare(password,UserExists.password)
     if(isMatch){
        const token= await UserExists.generateAuthToken();
        console.log(token)
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+500000),
            httpOnly:true
        })
        console.log(UserExists)
        res.status(201).json({message:"login successfully !!"})

     }else{
         res.status(422).json({error:"invalid email or password"})
     }
         
      



    }catch(e){
        console.log(e)
    }
})

router.post('/contact',auth,async(req,res)=>{
    try{
        const {name,email,phone,message}=req.body;
        console.log("req body--->",req.body);
        console.log("name---->",name);
        console.log("email---->",email);
        console.log('phone----->',phone);
        console.log("messaghe---->",message);
        if(!name||!email||!phone||!message){
            return res.json({error:"plz fill the fields"})
        }
        const contactUser=await Student.findOne({_id:req.UserId});
        if(contactUser){
          const messageData=await contactUser.addmessage(name,email,phone,message);
          await contactUser.save();
          res.status(201).send({message:"contact message send successfully!!"})


        }

    }catch(e){
        console.log(e)
    }
   

    
})
module.exports=router;