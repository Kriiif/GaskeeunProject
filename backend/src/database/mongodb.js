import mongoose from 'mongoose'
import { DATABASE_URL } from '../config/env.js'

if(!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DATABASE_URL)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1)
    }
}

export default connectToDatabase