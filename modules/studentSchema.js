const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
require('dotenv').config()
const StudentSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true,
    },
    work:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    cpassword:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    messages:[
        {
            name:{
                type:String,
                require:true,
            },
            email:{
                type:String,
                require:true,
            },
            phone:{
                type:String,
                require:true,
            },
            message:{
                type:String,
                require:true,
            }

        }
    ],
    tokens:[
        {
            token:{
                type:String,
                require:true
            }
        }
    ]
})

StudentSchema.pre('save',async function(next){
    console.log("hash password")
    if(this.isModified('password')){
        this.password= await  bcrypt.hash(this.password,12);
        this.cpassword= await bcrypt.hash(this.cpassword,12);
    }
    next();
})

StudentSchema.methods.generateAuthToken=async function(){

    try{
        const token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token ;
    }
    catch(e){
        console.log(e)


    }
    

}
StudentSchema.methods.addmessage=async function(name,email,phone,message){
    try{
        this.messages=await this.messages.concat({name,email,phone,message});
        await this.save();
        return this.messages;
    }catch(e){
        console.log(e)
    }
  

}


const Student=mongoose.model('Student',StudentSchema)
module.exports=Student;