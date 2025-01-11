import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { isBlacklisted } from '../utils/blacklist.js';

dotenv.config();

const authenticateToken = async (req, isAuthFreeOperation) => {
  if (isAuthFreeOperation) {
    return null;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Access denied. No token provided.');
  }

  if (isBlacklisted(token)) {
    throw new Error('Token has been invalidated. Please log in again.');
  }

  try {
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      user_id: user.id,
      role: user.role,
    };

    return user;
  } catch (err) {
    throw new Error('Invalid or expired token.');
  }
};

export default authenticateToken;
