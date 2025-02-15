import Student from "../models/student.js";

export const createStudent = async (req, res) => {
    try{

        const {firstName, lastName, email, hostel, rollNumber, year} = req.body;

        if( !firstName || !lastName || !email  || !hostel || !rollNumber || !year){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        const student = await Student.findOne({rollNumber:rollNumber});

        if(student){
            return res.json({
                success:false,
                message:"Student already registered"
            })
        }

        await Student.create(req.body);

        return res.json({
            success:true,
            message:"Student entry created successfully"
        })

    } catch(error){
        return res.json({
            success: false,
            message:"error in creating student entry",
            error: error
        })
    }
}

export const getStudentData = async (req, res) => {
    try{

        const rollNumber = req.body;

        if(!rollNumber){
            return res.json({
                success:false,
                message:"roll number is required"
            })
        }
        const student = await Student.findOne({rollNumber:rollNumber});

        if(!student){
            return res.json({
                success:false,
                message:"Invalid roll number"
            })
        }

        return res.json({
            success:true,
            message:"Student data found",
            data:student
        })
    } catch(error){
        return res.json({
            success:false,
            message:"error in fetching student data",
            error:error.message
        })
    }
}

export const getAllStudentsData = async (req, res) => {
    try{
        const students = await Student.find({});

        if(!students){
            return res.json({
                success:false,
                message:"No students found"
            })
        }

        const availableStudents = students.filter( (student)=>student.isAvailable===true);
        const notAvailableStudents = students.filter( (student)=>student.isAvailable===false);
        const totalStudents = students.length;
    
        return res.json({
            success:true,
            message:"students data found",
            data:{
                availableStudents,
                notAvailableStudents,
                totalStudents
            }
        })
        
    } catch(error){
        return res.json({
            success:false,
            message:"error in fetching students data",
            error:error.message
        })
    }
}

export const updateStudent = async (req, res) => {
    try{

        const {rollNumber, isGoingMarket} = req.body;

        if(!rollNumber || !isGoingMarket){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        const student = await Student.findOne({rollNumber:rollNumber});

        if(!student){
            return res.json({
                success:false,
                message:"Invalid roll number"
            })
        }

        const isAvailable = student.isAvailable;
        student.isGoingMarket = isGoingMarket;

        const day = Date().split(' ')[0];
        const time = Date().split(' ')[4];
        const date = Date().split(' ')[2] + "/" + Date().split(' ')[1]+"/" +Date().split(' ')[3];

        const updatedDate = {
            time,
            day,
            date
        }
        if(isAvailable){
           
            student.outgoingDate.push(updatedDate)
          
        }

        else{

            const date1=student.outgoingDate[student.outgoingDate.length-1].date;

            const diffTime = Math.abs(date - date1);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))-1;
            student.totalDaysOutside+=diffDays;

            
            student.incomingDate.push(updatedDate);
            
            
        }
        student.isAvailable=!isAvailable;
        await Student.save();

    } catch(error){
        return res.json({
            success:false,
            message:"error in updating student data",
            error:error.message
        })
    }
}


export const deleteStudent = async (req, res) => {
    try{

        const rollNumber = req.body;

        if(!rollNumber){
            return res.json({
                success:false,
                message:"roll number is required"
            })
        }

        if(!Student.findOne({rollNumber:rollNumber})){
            return res.json({
                success:false,
                message:"Invalid roll number"
            })
        }

        await Student.findOneAndDelete({rollNumber:rollNumber});

        return res.json({
            success:true,
            message:"Student entry deleted successfully",
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in deleting student entry",
        })
    }
}


// is it needed ?????
export const getAvailableStudents = async (req, res) => {
    try{

        const students = await Student.find({isAvailable:true});

        if(!students){
            return res.json({
                success:false,
                message:"No students found"
            })
        }

        const toatalAvailableStudents = students.length;
    
        return res.json({
            success:true,
            message:"students data found",
            data:students,
            toatalAvailableStudents:toatalAvailableStudents,
        })
    } catch(error){
        return res.json({
            success:false,
            message:"error in fetching students data",
            error:error.message
        })
    }
}