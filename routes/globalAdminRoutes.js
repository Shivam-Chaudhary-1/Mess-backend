import { Router } from "express";
import { createGlobalAdmin, getAllDetailsOfGlobalAdmin, loginGlobalAdmin, logoutGlobalAdmin, sendOtp, updateGlobalAdmin, verifyOtp } from "../controllers/globalAdminController.js";

const globalAdminRouter = Router();

globalAdminRouter.post('/create', createGlobalAdmin, sendOtp);
globalAdminRouter.post('/login', loginGlobalAdmin);
globalAdminRouter.post('/logout', logoutGlobalAdmin);
globalAdminRouter.post('/send-otp', sendOtp);
globalAdminRouter.post('/update', updateGlobalAdmin);
globalAdminRouter.post('/verify-otp', verifyOtp);
globalAdminRouter.get('/get-details', getAllDetailsOfGlobalAdmin);


export default globalAdminRouter;