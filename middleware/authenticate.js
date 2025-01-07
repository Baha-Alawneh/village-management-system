import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { isBlacklisted } from '../utils/blacklist.js';

dotenv.config();

const authenticateToken = (req, isAuthFreeOperation) => {

    console.log('Authenticating');
    if (isAuthFreeOperation) {
        return null; // Skip token verification for signup
      }
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer"

    if (!token) {
        // If no token is provided, deny access
        return 'Access denied. No token provided.';
    }

    if (isBlacklisted(token)) {
        return 'Token has been invalidated. Please log in again.';
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return 'Invalid or expired token.' ;
        }
        req.user = {
            user_id: user.id,  
            role: user.role    
        }
        return user;
    });
};

export default authenticateToken;
