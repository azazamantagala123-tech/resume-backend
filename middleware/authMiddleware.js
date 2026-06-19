import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const protectAdmin = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized', 401));
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || 'secret123'
  );

  const admin = await Admin.findById(decoded.id);

  if (!admin) {
    return next(new AppError('Admin not found', 401));
  }

  req.admin = admin;
  next();
});