import { config } from 'dotenv'

config({ path: '.env' })

export const { 
    PORT, 
    DATABASE_URL,
    JWT_SECRET, JWT_EXPIRES_IN,
    MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, FRONTEND_URL
} = process.env;