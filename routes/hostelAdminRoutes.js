import { Router } from "express";
import { createHostelAdmin, deleteHostelAdmin, getAllHostelAdmin, loginHostelAdmin, logoutHostelAdmin, updateHostelAdmin } from "../controllers/hostelAdminController.js";
import { isGlobalAdmin } from "../middleware/auth.js";

const hostelAdminRouter = Router();
// need auth for global admin
hostelAdminRouter.post('/create', isGlobalAdmin, createHostelAdmin);
hostelAdminRouter.post('/login', loginHostelAdmin);
hostelAdminRouter.post('/logout', logoutHostelAdmin);
hostelAdminRouter.post('/update', updateHostelAdmin);
hostelAdminRouter.get('/get-all-hostels', isGlobalAdmin, getAllHostelAdmin);
hostelAdminRouter.delete('/delete-hostel', isGlobalAdmin, deleteHostelAdmin);


export default hostelAdminRouter;