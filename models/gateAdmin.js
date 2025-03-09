import mongoose from "mongoose";

const gateSchema = new mongoose.Schema({
    gate:{
        type:String,
        required: true,
        trim:true,
    },
    email:{
        type:String,
        required: true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        default:"",
    },
    otp:{
        type:String,
        default:""
    },
    otpExpireTime:{
        type:Date,
        default:null,
    },
    role:{
        type:String,
        default:"gate-admin"
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    }
})

const Gate = mongoose.model('Gate', gateSchema);

export default Gate