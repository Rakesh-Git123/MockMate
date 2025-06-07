import express from "express"
const router = express.Router();
import isAuthenticated from "../middlewares/authenticate.js";
import isAdmin from "../middlewares/isAdmin.js";

import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  deleteInterview
}  from "../controllers/interview.controller.js"

router.post('/', isAuthenticated,isAdmin, createInterview);
router.get('/', isAuthenticated, getAllInterviews);
router.get('/:id', isAuthenticated, getInterviewById);
router.delete('/:id', isAuthenticated,isAdmin, deleteInterview);

export default router;
