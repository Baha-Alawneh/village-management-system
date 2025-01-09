import { getChatByUserAndAdmin } from "../models/chat.js";


const resolvers = {
    Query: {
        chat: async (parent, args) => {
            const result = await getChatByUserAndAdmin(args.user, args.admin);
                return result.chat;
           
        },
    },
};

export default resolvers;
