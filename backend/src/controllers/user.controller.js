import User from '../models/user.model.js';
import { hash, compare } from 'bcryptjs';
import mongoose from 'mongoose';

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

export const updateUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user._id; // Get user ID from auth middleware
        const { name, phone, email } = req.body;

        // Validate input
        if (!name || !phone || !email) {
            return res.status(400).json({ message: 'Name, phone, and email are required' });
        }

        // Check if email is already in use by another user
        const existingUser = await User.findOne({ 
            email, 
            _id: { $ne: userId } 
        });
        
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone, email },
            { 
                new: true, 
                session,
                select: '-password' // Exclude password from response
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error updating user:", error);
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Get user with password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has Google account (no password)
        if (user.googleId && user.password === 'google-auth') {
            return res.status(400).json({ message: 'Cannot change password for Google accounts' });
        }

        // Verify old password
        const isMatch = await compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await hash(newPassword, 10);

        // Update password
        await User.findByIdAndUpdate(
            userId,
            { password: hashedNewPassword },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error changing password:", error);
        next(error);
    }
}