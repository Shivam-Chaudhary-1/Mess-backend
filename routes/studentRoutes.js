import { Router } from "express";
import { createStudent, getAllStudentsData, getStudentData, updateStudent } from "../controllers/studentController.js";
import { auth } from "../middleware/auth.js";


const studentRouter = Router();

studentRouter.post('/create', createStudent);
studentRouter.post('/auth/update', auth, updateStudent);
studentRouter.get('/auth/get-student', auth, getStudentData);
studentRouter.get('/auth/get-all-students', auth, getAllStudentsData);

export default studentRouter;
