import { findUser, registerUser } from "../models/users.js"
import { AlreadyExistsError, InvalidCredentialsError,NotFoundError } from "../utils/errors.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
const resolvers = {
    Mutation: {
        signup: async (parent, args) => {
            try {
            const isExist = await findUser(args.username);
            if (isExist != "User not found") {
                throw new AlreadyExistsError("user already exists");
            }
            const hashedPassword = await hashPassword(args.input.password);
            const user = {
                username: args.input.username,
                password: hashedPassword,
                full_name: args.input.full_name,
                role: "user"
            }
            await registerUser(user);
            return "signup successfully";
        }catch(err) {
            return err.message;
        }
        },
        login: async (parent, args) => {
            try {
            const username = args.input.username.trim();
            const password = args.input.password.trim();;
            const user = await findUser(username);
            if (!user) {
                throw new NotFoundError("User not found");
            }
             const hashedPassword = user.password;
            const isMatch =await comparePassword(password,hashedPassword.trim());
            if (!isMatch) {
                throw new InvalidCredentialsError("Invalid credentials");
            }
            const token = await generateToken(user.user_id, user.role);
            return { token };
        }
        catch (error) {
           return error.message;
        }
        }
    }
}


export default resolvers;
