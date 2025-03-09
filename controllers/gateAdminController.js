import GlobalAdmin from '../models/globalAdmin.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import mailSender from '../config/mailSender.js';
import Gate from '../models/gateAdmin.js';
dotenv.config();

export const createGatelAdmin = async (req, res, next) => {
    try{
        const {gate, email, password, confirmPassword} = req.body;

        if(!gate || !email || !password || !confirmPassword){
            return res.json({
                success:false,
                message:"All fiels are required",
            })
        }

        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password and confirmPassword did not match"
            })
        }
        
        const user = await Gate.findOne({email:email});

        const isHostelRegistered = await Gate.findOne({gate:gate});

        if(isHostelRegistered){
            return res.json({
                success:false,
                message:"Hostel already registered"
            })
        }
        
        if(user){
            return res.json({
                success:false,
                message:"Admin already registered",
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        // const otp = String(Math.floor( 100000 + Math.random()*900000));
        
        await Gate.create({
            gate,
            email,
            password:hashedPassword,
            confirmPassword:hashedPassword,
        })
        console.log("data", email, gate, password, confirmPassword);

        return res.json({
            success:true,
            message:"admin created"
        })
        next();

    } catch(error){
        return res.json({
            success:false,
            message:"error in creating gate admin",
            error:error.message
        })
    }
}


export const verifyOtp = async (req, res) => {
    try{

        const {email, otp} = req.body;

        if(!email || !otp){
            return res.json({
                success:false,
                message:"All fields aree required"
            })
        }

        const user = await Gate.findOne({email:email});

        if(!user){
            return res.json({
                success:false,
                message:"User is not present"
            })
        }

        if(user.otp==="" || user.otp!==otp){
            return res.json({
                success:false,
                message:"Invalid otp"
            })
        }

        if(user.otpExpireTime < Date.now()){
            return res.json({
                success:false.valueOf,
                message:"Otp has been expired"
            })
        }

        user.otp="";
        user.otpExpireTime=0;
        user.isEmailVerified=true;

        await user.save();

        return res.json({
            success:true,
            message:"User has been verified"
        })

    } catch(error){
        return res.json({
            success:false,
            message:"Error in verify otp",
            error:error.message
        })
    }
}


export const loginGateAdmin = async (req, res) => {
    try{
        const {email, password} = req.body;

        if((!email || !password)){
            return res.json({
                success:false,
                message:"All fields are required",
            })
        }

        const user = await Gate.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message:"Admin is not present"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({
                success:false,
                message:"Invalid password"
            })
        }

        // send jwt token here

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
        res.cookie('token', token,{
            httpOnly:true,
            sameSite: 'none',
            secure:true,
            expires:new Date(Date.now() + 7*24*60*60*1000)
        })
        
        // is anything remaining
        user.token=token;
        await user.save();
        // console.log("user", user);

        user.password="";
        user.confirmPassword="";

        return res.json({
            success:true,
            message:"Loged in successfully",
            user
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in login",
            error:error.message
        })
    }
}

export const logoutGateAdmin = async (req, res) => {
    try{

        res.clearCookie('token',{
            httpOnly:true,
            sameSite: 'none',
        });

        return res.json({
            success:true,
            message:"Loged out successfully"
        })
    } catch(error){
        return res.json({
            success:false,
            message:"error in logout",
            error:error.message
        })
    }
}



// export const updateGlobalAdmin = async (req, res) => {
//     try{
        
//         const token = req.cookies.token;
//         if(!token){
//             return res.json({
//                 success:false,
//                 message:"token is not found"
//             })
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId=decoded.id;

//         if(!userId){
//             return res.json({
//                 success:false,
//                 message:"Id not found"
//             })
//         }

//         const user = await GlobalAdmin.findById(userId);
//         if(user.role!=="globalAdmin"){
//             return res.json({
//                 success:false,
//                 message:"Protected route for global admin"
//             })
//         }

//         const {firstName, lastName, email, contactNumber} = req.body;

//         await GlobalAdmin.findByIdAndUpdate((userId),
//             {
//                 firstName:firstName,
//                 lastName:lastName,
//                 email:email,
//                 contactNumber:contactNumber
//             },
//             {new:true}
//         )

//         //send mail here
        
//         return res.json({
//             success:true,
//             message:"Updated successfully"
//         })

//     } catch(error){
//         return res.json({
//             success:false,
//             message:"Updation failed in Global admin"
//         })
//     }
// }

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

       const user = await Gate.findById(userId);
       
       const hashedPassword = await bcrypt.hash(password, 10);

       user.password=hashedPassword;
       user.confirmPassword=hashedPassword;

       await user.save();

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

export const getAllGateAdmins = async (req, res) => {
    try{
       
        const gateAdmins = await Gate.find({});

        if(!gateAdmins){
            return res.json({
                success:false,
                message:"No gate Admins presents"
            })
        }

        return res.json({
            success:true,
            message:"Details of global admin",
            gateAdmins
        })

    } catch(error){
        return res.json({
            success:false,
            message:"Error in getting details of global admin"
        })
    }
}

export const deleteGateAdmin = async (req, res) =>{
    try{

        const {gate} = req.body;

        if(!gate){
            return res.json({
                success:false,
                message:"Gate is required"
            })
        }
        
        const result = await Gate.findOneAndDelete({gate});
        
        if(!result){
            return res.json({
                success:false,
                message:"Gate is not deleted"
            })
        }

        return res.json({
            success:true,
            message:"Gate admin got deleted"
        })
        

    } catch(error){
        return res.json({
            success:false,
            message:error.message
        })
    }
}