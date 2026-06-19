import Admin from '../models/Admin.js';
import Resume from '../models/Resume.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d'
  });
};

export const createAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  const adminExists = await Admin.findOne({ email });
  
  if (adminExists) {
    return next(new AppError('Admin already exists', 400));
  }
  
  const admin = await Admin.create({ email, password });
  
  res.status(201).json({
    success: true,
    message: 'Admin created successfully'
  });
});

export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  const admin = await Admin.findOne({ email });
  
  if (!admin) {
    return next(new AppError('Invalid credentials', 401));
  }
  
  const isMatch = await admin.comparePassword(password);
  
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }
  
  const token = generateToken(admin._id);
  
  res.json({
    success: true,
    token,
    admin: { email: admin.email }
  });
});

export const getAllResumes = catchAsync(async (req, res, next) => {
  const resumes = await Resume.find().sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: resumes.length,
    data: resumes
  });
});