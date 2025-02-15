import { trim } from "lodash";
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    firstName:{
        type:String,
        trim:true,
        required: true
    },
    lastName:{
        type:String,
        trim:true,
        required: true
    },
    contactNumber:{
        type:Number,
        required: true,
        // length:10
    },
    email:{
        type:String,
        trim:true,
        required: true
    },
    hostel:{
        type: String,
        trim: true,
        required: true
    },
    role:{
       type:String,
       default:"staff",
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
        default:null,
    },
    otpExpireTime:{
        type:Date,
        default:null,
    },
    rollNumber:{
        type:String,
        required: true
    }
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;