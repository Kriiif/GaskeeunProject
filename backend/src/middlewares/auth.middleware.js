import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token || token === 'null') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded JWT:', decoded);
        const user = await User.findById(decoded.userId);
        if(!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(401).json({ message: 'Unauthorizedtes' });
    }
}

export default authorize;
