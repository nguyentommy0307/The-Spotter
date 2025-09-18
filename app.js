const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { spotterSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const spotter = require('./models/spotter');
const Review = require('./models/review')


mongoose.connect('mongodb://localhost:27017/the-spot');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

const validateSpotter = (req, res, next) => {
    const { error } = spotterSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/spotters', catchAsync(async (req, res) => {
    const spotters = await spotter.find({});
    res.render('spotters/index', { spotters })
}))

app.get('/spotters/new', (req, res) => {
    res.render('spotters/new')
})

app.post('/spotters', validateSpotter, catchAsync(async (req, res, next) => {
    const GymSpot = new spotter(req.body.spotter);
    await GymSpot.save();
    res.redirect(`/spotters/${GymSpot._id}`)

}))

app.get('/spotters/:id', catchAsync(async (req, res) => {
    const spotters = await spotter.findById(req.params.id).populate('reviews');
    res.render('spotters/show', { spotters })
}))

app.get('/spotters/:id/edit', catchAsync(async (req, res) => {
    const spotters = await spotter.findById(req.params.id)
    res.render('spotters/edit', { spotters })
}))

app.put('/spotters/:id', validateSpotter, catchAsync(async (req, res) => {
    const { id } = req.params;
    const Gymspot = await spotter.findByIdAndUpdate(id, { ...req.body.spotter })
    res.redirect(`/spotters/${Gymspot._id}`)
}))

app.delete('/spotters/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await spotter.findByIdAndDelete(id);
    res.redirect('/spotters');
}))

app.post('/spotters/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const spotters = await spotter.findById(req.params.id);
    const review = new Review(req.body.review);
    spotters.reviews.push(review);
    await review.save();
    await spotters.save();
    res.redirect(`/spotters/${spotters._id}`)
}))

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something has gone wrong'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})

