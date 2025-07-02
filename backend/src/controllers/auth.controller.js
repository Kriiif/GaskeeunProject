import { OAuth2Client } from 'google-auth-library'
import User from '../models/user.model.js';
import { hash } from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import { compare } from 'bcryptjs';

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, phone, email, password } = req.body;

        // Validate input
        if (!name || !phone || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash password
        const passwordHashed = await hash(password, 10);

        // Create user
        const newUsers = await User.create([{
            name,
            phone,
            email,
            password: passwordHashed,
        }], { session });

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();
        // Respond with success
        return res.status(201).json({
            message: 'User created successfully',
            user: {
                name: newUsers[0].name,
                email: newUsers[0].email,
                role: newUsers[0].role,
            },
            token
        });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    }
}

export const signIn = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        // Respond with success
        return res.status(200).json({
            message: 'User signed in successfully',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token
        });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    }
}

export const signOut = async (req, res, next) => {
    
}

// Google OAuth2 client setup
const client = new OAuth2Client('76727925757-6m2gt2l6svlocupl9450b4l0chhh1pro.apps.googleusercontent.com');

export const googleSignIn = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '76727925757-6m2gt2l6svlocupl9450b4l0chhh1pro.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    // Cek apakah user sudah ada
    let user = await User.findOne({ email });

    // Kalau belum, buat user baru (tanpa password)
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        googleId: sub, // opsional, bisa simpan Google ID
        password: 'google-auth', // placeholder aja biar gak null
      });
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({
      message: 'Google login success',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
      token: jwtToken,
    });

  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

export const getMe = async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
};