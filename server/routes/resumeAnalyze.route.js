import { Router } from 'express';
import multer from 'multer';
const router = Router();

const upload = multer({ dest: "uploads/" });
import { resumeAnalyze } from '../controllers/resumeAnalyze.controller.js';

router.post("/analyze", upload.single("resume"), resumeAnalyze);

export default router;
