import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { isBlacklisted } from '../utils/blacklist.js';

dotenv.config();

const authenticateToken = async (req, isAuthFreeOperation) => {
  console.log('Authenticating');
  if (isAuthFreeOperation) {
    console.log('Authenticating freeees...');
    return null; // Skip token verification for signup
  }
    console.log('Authenticating  after login...');
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer"

  if (!token) {
    // If no token is provided, deny access
    throw new Error('Access denied. No token provided.');
  }

  // Check if the token is blacklisted
  if (isBlacklisted(token)) {
    throw new Error('Token has been invalidated. Please log in again.');
  }

  try {
    // Verify the token asynchronously using JWT secret
    const user = await jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request object for future use
    req.user = {
      user_id: user.id,
      role: user.role,
    };

    return user; // Return the decoded user object
  } catch (err) {
    throw new Error('Invalid or expired token.');
  }
};

export default authenticateToken;
