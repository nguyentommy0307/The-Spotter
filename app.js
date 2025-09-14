const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const spotter = require('./models/spotter');


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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/spotters', async (req, res) => {
    const spotters = await spotter.find({});
    res.render('spotters/index', { spotters })
})

app.get('/spotters/new', (req, res) => {
    res.render('spotters/new')
})

app.post('/spotters', async (req, res) => {
    const GymSpot = new spotter(req.body.spotter);
    await GymSpot.save();
    res.redirect(`/spotters/${GymSpot._id}`)
})

app.get('/spotters/:id', async (req, res) => {
    const spotters = await spotter.findById(req.params.id)
    res.render('spotters/show', { spotters })
})

app.get('/spotters/:id/edit', async (req, res) => {
    const spotters = await spotter.findById(req.params.id)
    res.render('spotters/edit', { spotters })
})

app.put('/spotters/:id', async (req, res) => {
    const { id } = req.params;
    const Gymspot = await spotter.findByIdAndUpdate(id, { ...req.body.spotter })
    res.redirect(`/spotters/${Gymspot._id}`)
});

app.delete('/spotters/:id', async (req, res) => {
    const { id } = req.params;
    await spotter.findByIdAndDelete(id);
    res.redirect('/spotters');
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})