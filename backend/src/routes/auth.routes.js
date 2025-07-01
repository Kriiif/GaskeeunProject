import express from 'express'
import { googleSignIn } from '../controllers/auth.controller.js'
import { signUp } from '../controllers/auth.controller.js'

const router = express.Router()

// router.get('/', ())

router.post('/signup', signUp)

router.post('/login-google', googleSignIn)

export default router