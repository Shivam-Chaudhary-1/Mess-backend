import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
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
    rollNumber:{
        type:String,
        trim:true,
        required: true
    },
    // contactNumber:{
    //     type:Number,
    //     required: true,
    //     // length:10
    // },
    email:{
        type:String,
        trim:true,
        required: true
    },
    year:{
        type:Number,
        required: true
    },
    hostel:{
        type: String,
        trim: true,
        required: true
    },
    outgoingDate:[
        {
            time:{
                type:String,
                required:true,
                trim:true
            },
            day:{
                type:String,
                required:true,
                trim:true
            },
            date:{
                type:String,
                required:true,
                trim:true
            }
        }
    ],
    incomingDate:[
        {
            time:{
                type:String,
                required:true,
                trim:true
            },
            day:{
                type:String,
                required:true,
                trim:true
            },
            date:{
                type:String,
                required:true,
                trim:true
            }
        }
   ],
   totalDaysOutside:{
       type:Number,
       default:0
    },
    role:{
        type:String,
        default:"student",
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    isGoingMarket:{
        type:Boolean,
        default:false
    }
});

const Student = mongoose.model('Student', studentSchema);

export default Student