const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn } = require('../middleware')
const { validateSpotter } = require('../middleware')
const { isAuthor } = require('../middleware')

const spotter = require('../models/spotter')


router.get('/', catchAsync(async (req, res) => {
    const spotters = await spotter.find({});
    res.render('spotters/index', { spotters })
}))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('spotters/new');
})


router.post('/', isLoggedIn, validateSpotter, catchAsync(async (req, res, next) => {
    const GymSpot = new spotter(req.body.spotter);
    GymSpot.author = req.user._id;
    await GymSpot.save();
    req.flash('success', 'Successfully put in a new gym!');
    res.redirect(`/spotters/${GymSpot._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const spotters = await spotter.findById(req.params.id).populate('reviews').populate('author');
    console.log(spotters);
    if (!spotters) {
        req.flash('error', 'Cannot find that gym');
        return res.redirect('/spotters');
    }
    res.render('spotters/show', { spotters })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spotters = await spotter.findById(id);
    if (!spotters) {
        req.flash('error', 'Cannot find  that spot')
        return res.redirect(`/spotters/${id}`)
    }
    res.render('spotters/edit', { spotters });
}))

router.put('/:id', isLoggedIn, isAuthor, validateSpotter, catchAsync(async (req, res) => {
    const { id } = req.params;
    const Gymspot = await spotter.findByIdAndUpdate(id, { ...req.body.spotter });
    req.flash('success', 'Successfully updated gym information')
    res.redirect(`/spotters/${Gymspot._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await spotter.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted gym')
    res.redirect('/spotters');
}))

module.exports = router;