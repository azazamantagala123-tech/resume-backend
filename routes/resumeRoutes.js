import express from 'express';
import * as resumeController from '../controllers/ResumeController.js';

const router = express.Router();

router.post('/', resumeController.createResume);
router.get('/user/:email', resumeController.getUserResumes);
router.get('/:id', resumeController.getResumeById);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);
router.post('/generate-summary', resumeController.generateSummary);

export default router;