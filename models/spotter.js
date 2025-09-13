const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpotterSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Spotter', SpotterSchema);