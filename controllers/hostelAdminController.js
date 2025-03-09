import Admin from '../models/admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createHostelAdmin = async (req, res) => {
    try{
        const {firstName, lastName, hostel, email, contactNumber, password, confirmPassword} = req.body;
        
        console.log("Admin created successfully", firstName, lastName, hostel, email, contactNumber, password, confirmPassword);
        if(!firstName || !lastName || !hostel  || !email|| !contactNumber || !password || !confirmPassword){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }
        
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password and confirmPassword did not match"
            })
        }
        
        let admin = await Admin.findOne({email:email});
        
        if(admin){
            return res.json({
                success:false,
                message:"Admin already registered",
            })
        }
        
        admin = await Admin.findOne({hostel:hostel});
        
        if(admin){
        return res.json({
                success:false,
                message:"This hostel already registered",
            })
        }
                
                
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await Admin.create({
            firstName,
            lastName,
            hostel,
            email,
            contactNumber,
            password:hashedPassword,
            confirmPassword:hashedPassword
        })
        console.log("Admin created successfully-", firstName, lastName, hostel, email, contactNumber, password, confirmPassword);

        //send email


        return res.json({
            success:true,
            message:"Admin created successfully",
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in creating admin",
            error:error.message
        })
    }
}

export const loginHostelAdmin = async (req, res) =>{
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        console.log("hostel");

        const user = await Admin.findOne({email: email});

        if(!user){
            return res.json({
                success:false,
                message:"Admin not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({
                success:false,
                message:"Wrong password"
            })
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly:true,
            sameSite: 'none',
            secure:true,
            maxAge:new Date(Date.now() + 7*24*60*60*1000)
        })

        user.token = token;
        await user.save();

        user.password="";
        user.confirmPassword="";

        // is anything remaining

        return res.json({
            success:true,
            message:"Admin logged in successfully",
            user
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in login admin",
            error:error.message
        })
    }
}


export const logoutHostelAdmin = async (req, res) => {
    try{

        const token = req.cookies.token;

        if(!token){
            return res.json({
                success:false,
                message:"Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminId=decoded.id;

        const admin = await Admin.findById(adminId);

        if(!admin){
            return res.json({
                success:false,
                message:"Admin not found"
            })
        }

        res.clearCookie('token',{
            httpOnly:true,
            sameSite: 'none',
            secure:true
        })

        return res.json({
            success:true,
            message:"Admin logged out successfully"
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in logout admin",
            error:error.message
        })
    }
}

export const getAllHostelAdmin = async (req, res) => {
     try{

        const admins = await Admin.find({});

        if(admins.length === 0){
            return res.json({
                success:false,
                message:"No hostel admin found"
            })
        }

        // console.log("All hostel admin found", admins);

        return res.json({
            success:true,
            message:"All hostel admin found",
            admins
        })

     } catch(error){
        return res.json({
            success:false,
            message:"error in getting all hostel admin",
            error:error.message
        })
     }
}

export const deleteHostelAdmin = async (req, res) => {
    try{

        const {hostel} = req.body;
        console.log("hostel", hostel);

        if(!hostel){
            return res.json({
                success:false,
                message:"hostel is required"
            })
        }

        const admin = await Admin.findOneAndDelete({hostel:hostel});
        
        if(!admin){
            return res.json({
                success:false,
                message:"Admin not found",
                error:error.message
            })
        }

        return res.json({
            success:true,
            message:"Admin deleted successfully",
        })
        

    } catch(error){
        return res.json({
            success:false,
            message:"error in deleting hostel admin",
            error:error.message
        })
    }
}


export const updateHostelAdmin = async (req, res) => {
    try{

        const {firstName, lastName, contactNumber, email} = req.body;

        if(!firstName || !lastName || !contactNumber || !email){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }
        console.log("updating..", firstName, lastName, contactNumber, email)

        const token = req.cookies.token;

        if(!token){
            return res.json({
                success:false,
                message:"Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminId=decoded.id;

        const admin = await Admin.findById(adminId);

        if(!admin){
            return res.json({
                success:false,
                message:"Admin not found"
            })
        }

        admin.contactNumber=contactNumber,
        admin.firstName=firstName,
        admin.lastName=lastName,

        await admin.save();

        console.log("fn", admin.firstName);

        return res.json({
            success:true,
            message:"Admin updated successfully",
            data:admin
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in updating admin",
        })
    }
}

export const updatePassword = async (req, res) =>{
    try{

       const {password, confirmPassword} = req.body;

       if(password!==confirmPassword){
        return res.json({
            success:false,
            message:"password did not match"
        })
       }

       const token = req.cookies.token;

       if(!token){
        return res.json({
            success:false,
            message:"token is not available"
        })
       }
       
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const userId = decoded.id;

       const admin = await Admin.findById(userId);
       
       const hashedPassword = await bcrypt.hash(password, 10);

       admin.password=hashedPassword;
       admin.confirmPassword=hashedPassword;

       await admin.save();

       //send mail here

       return res.json({
        success:true,
        message:"Password updated successfull"
       })


    } catch(error){
        return res.json({
            success:false,
            message:"Error in updating password"
        })
    }
}