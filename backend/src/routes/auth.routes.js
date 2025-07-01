import express from 'express'
import { googleSignIn } from '../controllers/auth.controller.js'

const router = express.Router()

// router.get('/', ())

router.post('/login-google', googleSignIn)

export default router