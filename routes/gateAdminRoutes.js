import { Router } from "express";
// import { isGlobalAdmin } from "../middleware/auth.js";
import { createGatelAdmin, deleteGateAdmin, getAllGateAdmins, loginGateAdmin, logoutGateAdmin, verifyOtp } from "../controllers/gateAdminController.js";

const gateAdminRouter = Router();

gateAdminRouter.post('/create', createGatelAdmin);
gateAdminRouter.post('/login', loginGateAdmin);
gateAdminRouter.post('/verify-otp', verifyOtp);
gateAdminRouter.post('/logout', logoutGateAdmin);
gateAdminRouter.get('/get-all-gates', getAllGateAdmins);
gateAdminRouter.post('/delete-gate', deleteGateAdmin);

export default gateAdminRouter;