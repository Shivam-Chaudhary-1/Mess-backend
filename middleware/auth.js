
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