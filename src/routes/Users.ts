import express from "express";
import { requireLogin } from "../middlewares/requireLogin";
import { changePassword, login, signup } from "../controllers/Users";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/changePassword", requireLogin, changePassword);

export default router;
