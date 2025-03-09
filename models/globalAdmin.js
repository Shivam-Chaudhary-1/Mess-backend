import mongoose from "mongoose";

const globalAdminSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        trim:true,
    },
    lastName:{
        type:String,
        required: true,
        trim:true,
    },
    email:{
        type:String,
        required: true,
        trim:true,
    },
    contactNumber:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    confirmPassword:{
        type:String,
        required:true,
        trim:true
    },
    otp:{
        type:String,
        default:'',
    },
    token:{
        type:String,
        default:'',
    },
    role:{
        type:String,
        default:"globalAdmin",
    },
    otpExpireTime:{
        type:Date,
        default:0,
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
})

const GlobalAdmin = mongoose.model('GlobalAdmin', globalAdminSchema);

export default GlobalAdmin;