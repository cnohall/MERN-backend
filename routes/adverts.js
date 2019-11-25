const router = require('express').Router();
let Advert = require('../models/advert.model');

router.route('/').get((req, res) => {
    Advert.find()
        .then(adverts => res.json(adverts))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route('/add').post((req, res) => {
    
    const name = req.body.name;
    const email = req.body.email;
    const emailCheck = req.body.emailCheck;
    const phone = req.body.phone;
    const place = req.body.place;
    const area = req.body.area;
    const zipCode = req.body.zipCode;
    const title = req.body.title;
    const description = req.body.description;
    const picture = req.body.picture;
    const price = req.body.price;


    const newAdvert = new Advert({
        name,
        email,
        emailCheck,
        phone,
        place, 
        area,
        zipCode,
        title,
        description,
        picture,
        price,
    });


    console.log("added");
    newAdvert.save()
        .then(() => res.json('Advert added!'))
        .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;