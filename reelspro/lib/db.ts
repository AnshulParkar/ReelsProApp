import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("Please Define monogoDB uri in env file");
}

let cached = global.mongoose;

if(!cached){

    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

export async function connectToDatabase() { // 
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // Enable buffering of commands 
            maxPoolSize: 10, // Set maximum pool size
        };
        
            cached.promise = mongoose
                .connect(MONGODB_URI, opts)
                .then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}
