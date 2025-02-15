import Admin from '../models/admin.js';
import jwt from 'jsonwebtoken';

export const createHostelAdmin = async (req, res) => {
    try{
        const {firstName, lastName, hostel, email, contactNumber, role, password, confirmPassword} = req.body;

        if(!firstName || !password || !confirmPassword  || !lastName|| !hostel || !email || !contactNumber || !role){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        if(password!=confirmPassword){
            return res.json({
                success:false,
                message:"Password and confirmPassword did not match"
            })
        }

        const admin = await Admin.findOne({email:email});

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
                message:"This hostel has its admin already",
            })
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            firstName,
            lastName,
            hostel,
            email,
            contactNumber,
            role,
            password:hashedPassword,
            confirmPassword:hashedPassword
        })

        //send email


        return res.json({
            success:true,
            message:"Admin created successfully"
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

        const admin = await Admin.findOne({email: email});

        if(!admin){
            return res.json({
                success:false,
                message:"Admin not found"
            })
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if(!isMatch){
            return res.json({
                success:false,
                message:"Wrong password"
            })
        }

        const token = jwt.sign({id:admin._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly:true,
            sameSite: 'none',
            maxAge:new Date(Date.now() + 7*24*60*60*1000)
        })

        // is anything remaining

        return res.json({
            success:true,
            message:"Admin logged in successfully",
            data:admin
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

        return res.json({
            success:true,
            message:"All hostel admin found",
            data:admins
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

        const {firstName, lastName, contactNumber} = req.body;

        if(!firstName || !lastName || !contactNumber){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

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

        await admin.save({
            contactNumber:contactNumber,
            firstName:firstName,
            lastName:lastName
        })

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