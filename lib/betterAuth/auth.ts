import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/moongose";
import { nextCookies } from "better-auth/next-js";

// singleton instance to prevent multiple instances in hot reload
let authIntance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authIntance) {
        return authIntance;
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if(!db){
        throw new Error("Database connection is not established");
    }

    authIntance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseUrl: process.env.BETTER_AUTH_URL,
        emailAndPassword:{
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins:[
            nextCookies()
        ],
    });

    return authIntance;
}

export const auth = await getAuth();