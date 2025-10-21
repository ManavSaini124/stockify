import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_STRING || '';

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

// hot reload dont create multiple connections
let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase  = async()=>{
    if(!MONGODB_URI){
        throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI,{bufferCommands: false});
    }

    try{
        cached.conn = await cached.promise;
    }catch(err){
        cached.promise = null;
        throw err;
    }

    console.log("Connected to MongoDB");
    return cached.conn;                  
}

