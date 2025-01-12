import mongoose from 'mongoose'
const MONGODB_URL = process.env.MONGODB_URL!

if (!MONGODB_URL) {
  throw new Error('MONGODB_URL not defined')
}
let isConnected = false // Track the connection status

export default async function connectToDatabase () {
  if (isConnected) return
  try {
    await mongoose.connect(MONGODB_URL)
    isConnected = true
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}
