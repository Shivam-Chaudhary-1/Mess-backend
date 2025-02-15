import Staff from '../models/staffs.js';

export const createStaff = async (req, res) => {
    try{

        const {name, email, contactNumber, hostel ,role, rollNumber} = req.body;

        if( !name || !email || !contactNumber || !hostel || !role || !rollNumber){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        const staff = await Staff.findOne({rollNumber:rollNumber});

        if(staff){
            return res.json({
                success:false,
                message:"staff already registered"
            })
        }

        await Staff.create(req.body);

        return res.json({
            success:true,
            message:"staff entry created successfully"
        })

    } catch(error){
       return res.json({
        success:false,
        message:"error in creating staff",
        error:error.message
       })
    }
}

export const getAllStaff = async (req, res) => {
    try{
        const staff = await Staff.find({});

        if(staff.length === 0){
            return res.json({
                success:false,
                message:"No staff found"
            })
        }

        return res.json({
            success:true,
            message:"All staff found",
            data:staff
        })

    } catch(error){
        return res.json({
            success:false,
            messgae:"error in getting all staff",
        })
    }
}

export const getStaff = async (req, res) => {
    try{

        const rollNumber = req.rollNumber;
        if(!rollNumber){
            return res.json({
                success:false,
                message:"roll number is required"
            })
        }

        const staff = await Staff.findOne({rollNumber:rollNumber});

        if(!staff){
            return res.json({
                success:false,
                message:"staff not registered",
            })
        }

        return res.json({
            success:true,
            message:"staff found",
            data:staff
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in getting staff",
            error:error.message
        })
    }
}

export const deleteStaff = async (req, res) => {
    try{

        const rollNumber = req.rollNumber;

        if(!rollNumber){
            return res.json({
                success:false,
                message:"roll number is required"
            })
        }

        const staff = await Staff.findOneAndDelete({rollNumber:rollNumber});

        if(!staff){
            return res.json({
                success:false,
                message:"staff not found"
            })
        }

        return res.json({
            success:true,
            message:"staff deleted successfully"
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in deleting staff",
            error:error.message,
        })
    }
}


