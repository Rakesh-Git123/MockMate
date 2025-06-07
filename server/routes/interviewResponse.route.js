import { Router } from 'express';
const router = Router();
import { submitInterviewResponse, getUserResponses, getResponseByUserAndInterviewId } from '../controllers/interviewResponse.controller.js';
import isAuthenticated from '../middlewares/authenticate.js'; 

router.post('/', isAuthenticated, submitInterviewResponse);
router.get('/my-responses', isAuthenticated, getUserResponses);
router.get('/:interviewId', isAuthenticated, getResponseByUserAndInterviewId);

export default router;
