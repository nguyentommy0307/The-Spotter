const spotter = require('../models/spotter');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const spotters = await spotter.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    spotters.reviews.push(review);
    await review.save();
    await spotters.save();
    req.flash('success', 'Created new reivew')
    res.redirect(`/spotters/${spotters._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await spotter.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/spotters/${id}`);
}