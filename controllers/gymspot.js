const spotter = require('../models/spotter');
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const spotters = await spotter.find({});
    res.render('spotters/index', { spotters })
}

module.exports.renderNewForm = (req, res) => {
    res.render('spotters/new');
}

module.exports.createGymspot = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.spotter.location, { limit: 1 });
    // console.log(geoData);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/spotters/new');
    }
    const GymSpot = new spotter(req.body.spotter);
    GymSpot.geometry = geoData.features[0].geometry;
    GymSpot.location = geoData.features[0].place_name;
    GymSpot.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    GymSpot.author = req.user._id;
    await GymSpot.save();
    console.log(GymSpot)
    req.flash('success', 'Successfully put in a new gym!');
    res.redirect(`/spotters/${GymSpot._id}`)
}

module.exports.showGymspot = async (req, res) => {
    const spotters = await spotter.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(spotters);
    if (!spotters) {
        req.flash('error', 'Cannot find that gym');
        return res.redirect('/spotters');
    }
    res.render('spotters/show', { spotters })
}

module.exports.editGymspot = async (req, res) => {
    const { id } = req.params;
    const spotters = await spotter.findById(id);
    if (!spotters) {
        req.flash('error', 'Cannot find  that spot')
        return res.redirect(`/spotters/${id}`)
    }
    res.render('spotters/edit', { spotters });
}

module.exports.updateGymspot = async (req, res) => {
    const { id } = req.params;
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // console.log(geoData);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/spotters/${id}/edit`);
    }

    const Gymspot = await spotter.findById(id);
    Gymspot.geometry = geoData.features[0].geometry;
    Gymspot.location = geoData.features[0].place_name;

    Gymspot.set(req.body.spotter);

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    Gymspot.image.push(...imgs);

    await Gymspot.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await Gymspot.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('success', 'Successfully updated gym information');
    res.redirect(`/spotters/${Gymspot._id}`);
}
module.exports.deleteGymspot = async (req, res) => {
    const { id } = req.params;
    await spotter.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted gym')
    res.redirect('/spotters');
}