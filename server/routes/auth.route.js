import express from "express";
import multer from "multer"
import { checkAuth, login, logout } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.js";
const router=express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });


router.post("/login",login);
router.post("/logout",logout);
router.get("/check", authenticate, checkAuth);

export default router;