import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', adminController.createAdmin);
router.post('/login', adminController.adminLogin);
router.get('/resumes', protectAdmin, adminController.getAllResumes);

export default router;