const router = require('express').Router();
let Advert = require('../models/advert.model');
const multer = require('multer');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const ObjectId = require('mongodb').ObjectID;




const password = process.env.ATLAS_PASSWORD;
const ATLAS_URI = "mongodb+srv://cnohall:" + password+ "@advertdata-bukei.mongodb.net/test?retryWrites=true&w=majority"

const storage = new GridFsStorage({
    url: ATLAS_URI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err)
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
          }
          resolve(fileInfo)
        })
      })
    },
  })
  

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(new Error('wrong type of file'), false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.route('/').get((req, res) => {
    Advert.find()
        .then(adverts => res.json(adverts))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route('/find/:id').get((req, res) => {
  const id = req.params.id;
  Advert.find( { "_id": ObjectId(id) } )
      .then(adverts => res.json(adverts))
      .catch(err => res.status(400).json("Error: " + err));
});

router.route('/title').get((req, res) => {
  Advert.find({}, {title:1, _id:0})
      .then(titles => res.json(titles))
      .catch(err => res.status(400).json("Error: " + err));
});

router.route('/title/:searchword').get((req, res) => {
  const searchword = req.params.searchword;
  Advert.find({title: { '$regex' : searchword, '$options' : 'i' } })
      .then(titles => res.json(titles))
      .catch(err => res.status(400).json("Error: " + err));
});

router.post('/add', upload.single('advertImage'), (req, res) => {
    
    console.log(req.file);
    const imageURL = "https://begtool-backend.herokuapp.com/image/" + req.file.filename;
    const name = req.body.name;
    const email = req.body.email;
    const emailCheck = req.body.emailCheck;
    const phone = req.body.phone;
    const place = req.body.place;
    const area = req.body.area;
    const zipCode = req.body.zipCode;
    const title = req.body.title;
    const description = req.body.description;
    const imageID = req.file.filename;
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
        imageID,
        imageURL,
        price,
    });


    console.log("added");
    newAdvert.save()
        .then(() => res.json('Advert added!'))
        .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;