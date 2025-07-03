import Review from '../models/review.model.js';
import Field from '../models/field.model.js';
import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';

export const createReview = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { booking_id, field_id, rating, comment } = req.body;
        const user_id = req.user._id;

        // Validate input
        if (!booking_id || !field_id || !rating) {
            return res.status(400).json({ message: 'Booking ID, Field ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if booking exists and belongs to the user
        const booking = await Booking.findOne({ _id: booking_id, user_id });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or does not belong to the user' });
        }

        // Check if user already reviewed this booking
        const existingReview = await Review.findOne({ booking_id });
        if (existingReview) {
            return res.status(409).json({ message: 'You have already reviewed this booking' });
        }

        // Create review
        const newReview = await Review.create([{
            user_id,
            booking_id,
            field_id,
            rating,
            comment: comment || ''
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: newReview[0]
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error creating review:", error);
        next(error);
    }
};

export const getReviewsByField = async (req, res, next) => {
    try {
        const { field_id } = req.params;

        const reviews = await Review.find({ field_id })
            .populate('user_id', 'name')
            .sort({ created_at: -1 });

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        next(error);
    }
};

export const getUserReviews = async (req, res, next) => {
    try {
        const user_id = req.user._id;

        const reviews = await Review.find({ user_id })
            .populate('field_id', 'name category location')
            .sort({ created_at: -1 });

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        next(error);
    }
};

export const updateReview = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { review_id } = req.params;
        const { rating, comment } = req.body;
        const user_id = req.user._id;

        // Validate input
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Find review and check ownership
        const review = await Review.findOne({ _id: review_id, user_id });
        if (!review) {
            return res.status(404).json({ message: 'Review not found or not authorized' });
        }

        // Update review
        const updatedReview = await Review.findByIdAndUpdate(
            review_id,
            { 
                ...(rating && { rating }),
                ...(comment !== undefined && { comment })
            },
            { 
                new: true, 
                session 
            }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error updating review:", error);
        next(error);
    }
};

export const deleteReview = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { review_id } = req.params;
        const user_id = req.user._id;

        // Find review and check ownership
        const review = await Review.findOne({ _id: review_id, user_id });
        if (!review) {
            return res.status(404).json({ message: 'Review not found or not authorized' });
        }

        // Delete review
        await Review.findByIdAndDelete(review_id, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error deleting review:", error);
        next(error);
    }
};
