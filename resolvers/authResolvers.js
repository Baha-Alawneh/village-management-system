import { findUser, registerUser,findUserById,getAdmins, getUsers } from "../models/users.js";
import { AlreadyExistsError, InvalidCredentialsError, NotFoundError } from "../utils/errors.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { addToBlacklist } from "../utils/blacklist.js";

const resolvers = {
  Query: {
    userById: async (parent, args) => {
      try {
        const user = await findUserById(args.id);
        
        if (!user) {
          throw new NotFoundError("User not found");
        }
        return user[0];
      } catch (error) {
        console.error("Error occurred:", error);
        throw new Error(error.message || "An error occurred during user lookup.");
      }
    },
    admins:async(parent,args)=> {
      try {
        const admins=await getAdmins();
        if (!admins) {
          throw new NotFoundError("No admins found");
        }
        return admins;
      } catch (error) {
        throw new Error(error.message || "An error occurred while fetching admins.");
      }
    },
    users:async(parent,args)=> {
      try {
        const users=await getUsers();
        if (!users) {
          throw new NotFoundError("No users found");
        }
        return users;
      } catch (error) {
        throw new Error(error.message || "An error occurred while fetching users.");
      }
    },
  }
  ,
  Mutation: {
    signup: async (parent, args) => {
      try {
        const { username, password, full_name } = args.input;
        const isExist = await findUser(username);
        if (isExist !== "User not found") {
          throw new AlreadyExistsError("User already exists");
        }
        const hashedPassword = await hashPassword(password);
        const user = {
          username,
          password: hashedPassword,
          full_name,
          role: "user",
        };

        await registerUser(user);
        return "Signup successful";
      } catch (err) {
        throw new Error(err.message || "An error occurred during signup.");
      }
    },

    login: async (parent, args) => {
      try {
        const { username, password } = args.input;

        const user = await findUser(username);
        if (!user) {
          throw new NotFoundError("User not found");
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          throw new InvalidCredentialsError("Invalid credentials");
        }

        const token = await generateToken(user.user_id, user.role);
        return { token };
      } catch (error) {
        throw new Error(error.message || "An error occurred during login.");
      }
    },
    logout:(parent,args) => {
      const token= args.token;
      addToBlacklist(token);
    },
    
  },
};

export default resolvers;
