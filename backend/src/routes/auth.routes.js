import express from 'express'
import { googleSignIn, signUp, signIn } from '../controllers/auth.controller.js'

const router = express.Router()

// router.get('/', ())

router.post('/signup', signUp)

router.post('/login', signIn)

router.post('/login-google', googleSignIn)

export default router