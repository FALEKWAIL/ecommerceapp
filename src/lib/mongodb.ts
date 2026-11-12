import mongoose from 'mongoose';
import * as dns from 'dns';

// Fix for Windows DNS resolution of MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore in environments where custom DNS isn't allowed
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing_store';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as unknown as {
  mongooseConnection?: MongooseCache;
};

if (!globalWithMongoose.mongooseConnection) {
  globalWithMongoose.mongooseConnection = { conn: null, promise: null };
}

const cached: MongooseCache = globalWithMongoose.mongooseConnection;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
