const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const advertSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    emailCheck: { type: String, required: true},
    area: { type: String, required: true},
    place: { type: String, required: true},
    title: { type: String, required: true},
    description: { type: String, required: true},
    imageURL: { type: String, required: true},
    imageID: { type: String, required: true},
    zipCode: { type: String, required: true},
    phone: { type: String, required: true},
    price: { type: String, required: true},
}, {
    timestamps: true,
});

const Advert = mongoose.model('Advert', advertSchema);

module.exports = Advert;