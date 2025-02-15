import GlobalAdmin from '../models/globalAdmin.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import mailSender from '../config/mailSender.js';
dotenv.config();

export const createGlobalAdmin = async (req, res, next) => {
    try{
        const {firstName, lastName, email, contactNumber, role, password, confirmPassword} = req.body;

        if(!firstName || !email || !contactNumber || !role || !password || !lastName || !confirmPassword){
            return res.json({
                success:false,
                message:"All fiels are required",
            })
        }

        if(password!=confirmPassword){
            return res.json({
                success:false,
                message:"Password and confirmPassword did not match"
            })
        }

        const user = await GlobalAdmin.findOne({email:email});

        if(user){
            return res.json({
                success:false,
                message:"Admin already registered",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = String(Math.floor( 100000 + Math.random()*900000));
        
        await GlobalAdmin.create({
            firstName,
            lastName,
            email,
            contactNumber,
            role,
            password:hashedPassword,
            confirmPassword:hashedPassword,
        })
        // console.log("started");

        // await mailSender(email, `You have logged in successfully ,your email verification otp is ${otp}`,  `Email verification`);

        // console.log("end");
        

        // return res.json({
        //     success:true,
        //     message:"admin created"
        // })
        next();

    } catch(error){
        return res.json({
            success:false,
            message:"error in creating global admin",
            error:error.message
        })
    }
}



export const sendOtp = async (req, res) => {
    try{
        const {email} = req.body;

        if(!email){
            return res.json({
                success:false,
                message:"Email is required",
            })
        }

        console.log("email", email);
    
        const user = await GlobalAdmin.findOne({email:email});
    
        if(!user){
            return res.json({
                success:false,
                message:"Admin is not present",
            })
        }
        const otp = String(Math.floor( 100000 + Math.random()*900000));
    
        // send otp to email here
        const info = await mailSender(email, `You have logged in successfully ,your email verification otp is ${otp}`,  `Email verification`);

        // if successfull
        user.otp = otp;
        user.otpExpireTime = Date.now() + 5*60*1000;
        await user.save();
    
        return res.json({
            success:true,
            message:"OTP sent successfully"
        })
    } catch(error){
        return res.json({
            success:false,
            message:"error in sending otp",
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

        const user = await GlobalAdmin.findOne({email:email});

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


export const loginGlobalAdmin = async (req, res) => {
    try{
        const {email, password} = req.body;

        if((!email || !password)){
            return res.json({
                success:false,
                message:"All fields are required",
            })
        }

        const user = await GlobalAdmin.findOne({email:email});
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
            expires:new Date(Date.now() + 7*24*60*60*1000)
        })

        // is anything remaining

        return res.json({
            success:true,
            message:"Loged in successfully"
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in login",
            error:error.message
        })
    }
}

export const logoutGlobalAdmin = async (req, res) => {
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



export const updateGlobalAdmin = async (req, res) => {
    try{
        
        const token = req.cookies.token;
        if(!token){
            return res.json({
                success:false,
                message:"token is not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId=decoded.id;

        if(!userId){
            return res.json({
                success:false,
                message:"Id not found"
            })
        }

        const {firstName, lastName, email, contactNumber} = req.body;

        await GlobalAdmin.findByIdAndUpdate((userId),
            {
                firstName:firstName,
                lastName:lastName,
                email:email,
                contactNumber:contactNumber
            },
            {new:true}
        )

        //send mail here
        
        return res.json({
            success:true,
            message:"Updated successfully"
        })

    } catch(error){
        return res.json({
            success:false,
            message:"Updation failed in Global admin"
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

       const user = await GlobalAdmin.findById(userId);
       
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