import { OAuth2Client } from 'google-auth-library'


export const signUp = async (req, res, next) => {
    
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