import express from 'express'
import { PrismaClient } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library';

const router = express.Router()
const prisma = new PrismaClient()
const client = new OAuth2Client('76727925757-6m2gt2l6svlocupl9450b4l0chhh1pro.apps.googleusercontent.com');

// router.get('/', ())

router.get('/login-google', (req, res) => {
    res.json({msg: "Success"})
})

router.post('/login-google', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '76727925757-6m2gt2l6svlocupl9450b4l0chhh1pro.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();

    // Example: save user or create JWT
    const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
    };

    res.json({ user });
})

export default router