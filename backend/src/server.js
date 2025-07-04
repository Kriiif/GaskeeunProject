import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import authRoutes from './routes/auth.routes.js'
import { PORT } from './config/env.js'
import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'
import cookieParser from 'cookie-parser'
import fieldRoutes from './routes/field.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import partnerReqRoutes from './routes/partner_req.routes.js';
import reviewRoutes from './routes/review.routes.js';
import venueRoutes from './routes/venue.routes.js';
import cartRoutes from './routes/cart.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import fieldTimesRoutes from './routes/field_times.routes.js';


dotenv.config()

const app = express()
const PORTS = PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use(express.static('public')); 

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/fields', fieldRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/partnership', partnerReqRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/venues', venueRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/dashboard/owner', dashboardRoutes);
app.use('/api/v1/field_times', fieldTimesRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Middleware untuk error handling
app.use(errorMiddleware)

app.get('/', (req, res) => {
  console.log(`${PORT}`)
  res.json({ 
    message: 'Server is Running!',
    timestamp: new Date().toISOString()
  })
})

// Health check
app.get('/health', (req, res) => {
  try {
    res.json({ status: 'healthy', database: 'connected' })
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' })
  }
})

// Start server
app.listen(PORTS, async () => {
  console.log(`Server running on http://localhost:${PORTS}`)
  await connectToDatabase();
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...')
  process.exit(0)
})