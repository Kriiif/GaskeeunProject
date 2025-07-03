import express from 'express';
import { 
    createReview, 
    getReviewsByField, 
    getUserReviews, 
    updateReview, 
    deleteReview 
} from '../controllers/review.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create a new review (user must be authenticated)
router.post('/', authorize, createReview);

// Get all reviews for a specific field
router.get('/field/:field_id', getReviewsByField);

// Get all reviews by the authenticated user
router.get('/user', authorize, getUserReviews);

// Update a review (user must own the review)
router.put('/:review_id', authorize, updateReview);

// Delete a review (user must own the review)
router.delete('/:review_id', authorize, deleteReview);

export default router;
