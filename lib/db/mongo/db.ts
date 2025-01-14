// import mongoose from 'mongoose'
// const MONGODB_URL = process.env.MONGODB_URL!

// if (!MONGODB_URL) {
//   throw new Error('MONGODB_URL not defined')
// }
// let isConnected = false // Track the connection status

// export default async function connectToDatabase () {
//   if (isConnected) return
//   try {
//     await mongoose.connect(MONGODB_URL)
//     isConnected = true
//     console.log('Connected to MongoDB')
//   } catch (error) {
//     console.error('Failed to connect to MongoDB:', error)
//     throw error
//   }
// }




import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined in the environment variables.');
}

// Track connection status
// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL)
      .then((mongooseInstance) => {
        console.log('Connected to MongoDB');
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
