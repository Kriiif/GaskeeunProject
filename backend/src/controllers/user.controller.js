import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        res.status(200).json({success: true, data: users});
    } catch (error) {
        console.error("Error fetching users:", error);
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({success: true, data: user});
    } catch (error) {
        console.error("Error fetching user:", error);
        next(error);
    }
}