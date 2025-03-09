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

        const student = await Student.findOne({rollNumber});

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
            student
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
    try {
        const {hostel} = req.body;
        const students = await Student.find({hostel});

        if (!students) {
            return res.json({
                success: false,
                message: "No students found"
            })
        }

        const availableStudents = students.filter((student) => student.isAvailable === true);
        const notAvailableStudents = students.filter((student) => student.isAvailable === false);
        const totalStudents = students.length;

        return res.json({
            success: true,
            message: "students data found",
            data: {
                availableStudents,
                notAvailableStudents,
                totalStudents
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "error in fetching students data",
            error: error.message
        })
    }
}

export const getCurrentStatus = async (req, res) => {
    try{

        const {hostel} = req.body;
        
        const totalStudents = await Student.find({hostel});

        if(!totalStudents){
            return res.json({
                success:false,
                message:"No students found"
            })
        }

        const availableStudents = totalStudents.filter( (student)=>student.isAvailable===true);
        const notAvailableStudents = totalStudents.filter( (student)=>student.isAvailable===false);
        const marketGoingStudents = notAvailableStudents.filter( (student)=>student.isGoingMarket===true);
        const homeGoingStudents = notAvailableStudents.filter( (student)=>student.isGoingMarket===false);
    
    
        return res.json({
            success:true,
            message:"students data found",
            totalStudents,
            availableStudents,
            marketGoingStudents,
            homeGoingStudents
        })
        
    } catch(error){
        return res.json({
            success:false,
            message:"error in fetching students data",
            error:error.message
        })
    }
}

// export const updateStudent = async (req, res) => {
//     try{

//         const {rollNumber, isGoingMarket} = req.body;

//         if(!rollNumber ){
//             return res.json({
//                 success:false,
//                 message:"All fields are required"
//             })
//         }

//         const student = await Student.findOne({rollNumber:rollNumber});

//         if(!student){
//             return res.json({
//                 success:false,
//                 message:"Invalid roll number"
//             })
//         }

//         const isAvailable = student.isAvailable;
//         student.isGoingMarket = isGoingMarket;

//         const day = Date().split(' ')[0];
//         const time = Date().split(' ')[4];
//         const date = Date().split(' ')[2] + "/" + Date().split(' ')[1]+"/" +Date().split(' ')[3];

//         const updatedDate = {
//             time,
//             day,
//             date
//         }
//         if(isAvailable){
           
//             student.outgoingDate.push(updatedDate)
          
//         }

//         else{

//             const date1=student.outgoingDate[student.outgoingDate.length-1].date;

//             const diffTime = Math.abs(date - date1);
//             const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))-1;
//             student.totalDaysOutside+=diffDays;

            
//             student.incomingDate.push(updatedDate);
            
            
//         }
//         student.isAvailable=!isAvailable;
//         await Student.save();

//     } catch(error){
//         return res.json({
//             success:false,
//             message:"error in updating student data",
//             error:error.message
//         })
//     }
// }

export const updateStudent = async (req, res) => {
    try {
        const { rollNumber, isGoingMarket } = req.body;

        if (!rollNumber || isGoingMarket === undefined) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.json({
                success: false,
                message: "Invalid roll number"
            });
        }

        const isAvailable = student.isAvailable;
        student.isGoingMarket = isGoingMarket;

        
        const now = new Date();
        const day = now.toLocaleString('en-US', { weekday: 'short' });
        const time = now.toTimeString().split(' ')[0];
        const date = `${now.getDate()}/${now.toLocaleString('en-US', { month: 'short' })}/${now.getFullYear()}`;

        const updatedDate = { time, day, date };

        if (isAvailable) {
            student.outgoingDate.push(updatedDate);
        } else {
            
            if (student.outgoingDate.length > 0) {
                const lastOutgoingDate = new Date(student.outgoingDate[student.outgoingDate.length - 1].date);
                const diffTime = Math.abs(now - lastOutgoingDate);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                student.totalDaysOutside += diffDays;
            }

            student.incomingDate.push(updatedDate);
        }

        student.isAvailable = !isAvailable;
        await student.save();

        return res.json({
            success: true,
            message: "Student data updated successfully",
            student
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Error in updating student data",
            error: error.message
        });
    }
};



export const deleteStudent = async (req, res) => {
    try{

        const {rollNumber, hostel} = req.body;

        if(!rollNumber || !hostel){
            return res.json({
                success:false,
                message:"All fields required"
            })
        }

        const student = await Student.findOne({rollNumber:rollNumber})
        if(!student){
            return res.json({
                success:false,
                message:"Invalid roll number"
            })
        }

        if(student.hostel!==hostel){
            return res.json({
                success:false,
                message:"Unaccessed student"
            })
        }
        
        // console.log('roll:', rollNumber);
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

export const checkEntryStudent = async (req, res) => {
    try {
        const { rollNumber } = req.body;
        
        
        if (!rollNumber) {
            return res.status(400).json({
                success: false,
                message: "Roll Number is required",
            });
        }
        
        const student = await Student.findOne({ rollNumber });
        
        if (!student) {
            return res.json({
                success: false,
                message: "Invalid roll number",
            });
        }
        // console.log("roll", student);

        const isAvailable = student.isAvailable;
        return res.json({
            success: true,
            message: "status checked",
            isAvailable: isAvailable
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting status of student",
            error: error.message,
        });
    }
};


export const outEntryStudent = async (req, res) => {
    try {
        const { rollNumber, goingStatus } = req.body;
        const student = await Student.findOne({ rollNumber });


        const isAvailable = student.isAvailable;
        if (goingStatus) {
            student.isGoingMarket = true;
        } else {
            if (student.isGoingMarket) {
                student.isGoingMarket = false;
            } else {

                const now = new Date();
                const formattedDate = now.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
                const formattedTime = now.toLocaleTimeString("en-GB"); // Format: HH:MM:SS
                const day = now.toLocaleString("en-US", { weekday: "long" });
                const updatedDate = {
                    time: formattedTime,
                    day,
                    date: formattedDate,
                };
                if (isAvailable) {
                    student.outgoingDate.push(updatedDate);
                } else {
                    if (student.outgoingDate.length === 0) {
                        return res.json({
                            success: false,
                            message: "No outgoing entry found for this student.",
                        });
                    }

                    const lastOutDate = student.outgoingDate[student.outgoingDate.length - 1].date;
                    const lastOutDateObj = new Date(lastOutDate.split('/').reverse().join('-')); // Convert DD/MM/YYYY to Date object

                    const diffTime = Math.abs(now - lastOutDateObj);
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                    student.totalDaysOutside += diffDays;
                    student.incomingDate.push(updatedDate);
                }
            }
        }
        student.isAvailable = !isAvailable;
        await student.save();

        return res.json({
            success: true,
            message: `Student ${goingStatus ? "checked in" : "checked out"} successfully.`,
            student,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating student data",
            error: error.message,
        });
    }
};