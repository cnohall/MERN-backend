const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const twoWeeksInMinutes = 60 * 24 * 14;

const annonsSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    emailCheck: { type: String, required: true},
    province: { type: String, required: true},
    area: { type: String, required: true},
    title: { type: String, required: true},
    category: { type: String, required: true},
    description: { type: String, required: true},
    imageURL: { type: String, required: true},
    imageID: { type: String, required: true},
    zipCode: { type: String, required: true},
    phone: { type: String, required: true},
    price: { type: String, required: true},
    createdAt: { type: Date, expires: twoWeeksInMinutes+ 'm', default: Date.now }
});

const Annons = mongoose.model('Annons', annonsSchema);

module.exports = Annons;