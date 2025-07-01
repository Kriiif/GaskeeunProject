import { OAuth2Client } from 'google-auth-library'
import User from '../models/user.model.js';
import { hash } from 'bcryptjs';


export const signUp = async (req, res) => {
  const { name, phone, email, password } = req.body;

  // Validate input
  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password
    const passwordHashed = await hash(password, 10);

    // Create user
    const user = new User({
      name,
      phone,
      email,
      password: passwordHashed,
    });

    await user.save();

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


export const signIn = async (req, res, next) => {
    
}

export const signOut = async (req, res, next) => {
    
}

// Google OAuth2 client setup
const client = new OAuth2Client('76727925757-6m2gt2l6svlocupl9450b4l0chhh1pro.apps.googleusercontent.com');

export const googleSignIn = async (req, res, next) => {
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
}