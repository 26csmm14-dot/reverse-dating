import mongoose from 'mongoose';

const DEFAULT_ATLAS_URI = 'mongodb+srv://26csmm14_db_user:btRXu57YKBaPR82i@cluster0.zhvganu.mongodb.net/reverse_dating?retryWrites=true&w=majority';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless invocations on Vercel.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
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
