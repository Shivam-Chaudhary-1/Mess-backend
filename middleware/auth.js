import jwt from 'jsonwebtoken'
import GlobalAdmin from '../models/globalAdmin.js';
import Admin from '../models/admin.js';
import Gate from '../models/gateAdmin.js';

export const auth = async (req, res, next) => {
      try{

        const token = req.cookies.token;

        if(!token){
            return res.json({
                success:false,
                message:"Token available"
            })
        }

       next();

      } catch(error){
        return res.json({
            success:false,
            message:"error in authentication",
            error:error.message
        })
      }
}

export const isGlobalAdmin = async (req, res, next) => {
  try{
      const token = req.cookies.token;

      if(!token){
        return
      }
      
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const id = decode.id;

      const user = await GlobalAdmin.findById(id);

      if(!user){
        return res.json({
          success:false,
          message:"Protected for global admin"
        })
      }

      next();
      
  } catch(error){
      return res.json({
        success:false,
        message:"Error in auth"
      })
  }
}


export const isAdmin = async (req, res, next) => {
  try{
      const token = req.cookies.token;
      
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const id = decode.id;

      const user = await Admin.findById(id);

      if(!user){
        return res.json({
          success:false,
          message:"Protected for hostel admin"
        })
      }

      next();
      
  } catch(error){
      return res.json({
        success:false,
        message:"Error in auth"
      })
  }
}


export const isGateAdmin = async (req, res, next) => {
  try{
      const token = req.cookies.token;
      
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const id = decode.id;

      const user = await Gate.findById(id);

      if(!user){
        return res.json({
          success:false,
          message:"Protected for Gate admin"
        })
      }

      next();
      
  } catch(error){
      return res.json({
        success:false,
        message:"Error in auth"
      })
  }
}