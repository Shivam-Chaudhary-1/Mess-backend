import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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
    hostel:{
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
    },
    confirmPassword:{
        type:String,
        required:true,
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
        default:"hostel-admin"
    }
})

const Admin = mongoose.model('Admin', adminSchema);

export default Admin