import express from 'express'
import { googleSignIn, signUp, signIn, getMe } from '../controllers/auth.controller.js'
import authorize from '../middlewares/auth.middleware.js'

const router = express.Router()

// router.get('/', ())

router.post('/signup', signUp)

router.post('/login', signIn)

router.post('/login-google', googleSignIn)

router.get('/me', authorize, getMe)

export default router