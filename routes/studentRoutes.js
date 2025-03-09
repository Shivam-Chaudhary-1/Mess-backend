import { Router } from "express";
import { checkEntryStudent, createStudent, deleteStudent, getAllStudentsData, getCurrentStatus, getStudentData, outEntryStudent, updateStudent } from "../controllers/studentController.js";
import { auth, isAdmin, isGateAdmin } from "../middleware/auth.js";


const studentRouter = Router();

studentRouter.post('/auth/create', isAdmin, createStudent);
studentRouter.post('/auth/update', isAdmin, updateStudent);
studentRouter.get('/auth/get-student', isAdmin, getStudentData);
studentRouter.post('/auth/get-all-students', isAdmin, getAllStudentsData);
studentRouter.post('/auth/delete-student', isAdmin, deleteStudent);
studentRouter.post('/auth/current-status', isAdmin, getCurrentStatus);
studentRouter.post('/auth/checkEntry', checkEntryStudent);
studentRouter.post('/auth/outEntry', outEntryStudent);

export default studentRouter;
