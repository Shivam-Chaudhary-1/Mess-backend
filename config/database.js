import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async (req, res) => {
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        .then( ()=>{console.log("Data base connected")})
        .catch( (error)=>{console.log("database error: ", error)});

    } catch(error){
       console.log("Error in database connection: ", error);
    }
}

export default connectDB;