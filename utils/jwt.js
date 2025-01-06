import jwt from 'jsonwebtoken';

const generateToken = async(userId,role) => {
  return jwt.sign({ id: userId,role:role }, process.env.JWT_SECRET, { expiresIn: '10h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { generateToken, verifyToken };
