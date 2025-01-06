import { findUser, registerUser } from "../models/users.js"
import { AlreadyExistsError, InvalidCredentialsError } from "../utils/errors.js";
import { hashPassword,comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";





const resolvers = {
    Mutation: {
         signup:async(parent,args)=> {
              const isExist=await findUser(args.username);
              if(isExist!="User not found"){
                  throw  new AlreadyExistsError("user already exists");
              }
              const hashedPassword=hashPassword(args.password);
                const user ={
                    username: args.username,
                    password: hashedPassword,
                    full_name: args.full_name,
                    role: "user"
                }
                await registerUser(user);
                return "signup successfully";
         },
         login: async(parent,args)=> {
            const username=args.input.username;
            const password=args.input.password;
            console.log(username,password);
             const user=await findUser(username);
             if(!user){
                 throw new Error("User not found");
             }
             console.log(user.username,user.password);
             const isMatch=password===user.password
            //  await comparePassword(args.password,user.password);
             if(!isMatch){
                 throw new InvalidCredentialsError("Invalid credentials");
             }
             const token= await generateToken(user.user_id,user.role);
             console.log(token);
             return {token};
         }

         
    }
}


export default resolvers;
