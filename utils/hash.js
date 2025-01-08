import argon2 from 'argon2';

const hashPassword = async (password) => {
   return await argon2.hash(password);
};

const comparePassword = async (password, hashedPassword) => {
    console.log('pass', password, hashedPassword);
   return argon2.verify(hashedPassword, password);
};

export { hashPassword, comparePassword };
