const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const gymspot = require('../controllers/gymspot')
const { isLoggedIn, validateSpotter, isAuthor } = require('../middleware')
const spotter = require('../models/spotter')

router.route('/')
    .get(catchAsync(gymspot.index))
    .post(isLoggedIn, validateSpotter, catchAsync(gymspot.createGymspot))

router.get('/new', isLoggedIn, gymspot.renderNewForm)

router.route('/:id')
    .get(catchAsync(gymspot.showGymspot))
    .put(isLoggedIn, isAuthor, validateSpotter, catchAsync(gymspot.updateGymspot))
    .delete(isLoggedIn, catchAsync(gymspot.deleteGymspot))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gymspot.editGymspot))

module.exports = router;