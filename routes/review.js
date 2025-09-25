const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const spotter = require('../models/spotter');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const spotters = await spotter.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    spotters.reviews.push(review);
    await review.save();
    await spotters.save();
    req.flash('success', 'Created new reivew')
    res.redirect(`/spotters/${spotters._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await spotter.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/spotters/${id}`);
}))

module.exports = router;