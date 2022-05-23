import express from "express";
import { requireLogin } from "../middlewares/requireLogin";
import { changePassword, deRegister, login, signup, userStatus } from "../controllers/Users";
const router = express.Router();

router.post("/signup",signup);
router.post("/userstatus",userStatus);
router.post("/login",login);
router.post("/changePassword",requireLogin,changePassword);
router.post("/deregister",requireLogin,deRegister);

export default router;