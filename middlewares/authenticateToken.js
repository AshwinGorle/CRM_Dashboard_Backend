import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  //  return next();
  // console.log("cookie----",req.cookies);
  if (!token) {
    return res.status(401).json({ status: 'failed', message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await UserModel.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    res.status(400).json({ status: 'failed', message: 'Invalid token.' });
  }
};

export default authenticateToken;
