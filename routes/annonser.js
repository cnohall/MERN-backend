const router = require('express').Router();
const Annons = require('../models/annons.model');
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
        const DaysToExpireIn = 14;
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err)
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
            expireAt: {
              type: Date,
              default: new Date(Date.now() + DaysToExpireIn*24*60*60*1000),
              index: { expires: '5m' },
              },
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
    fileFilter: fileFilter
});

router.route('/').get((req, res) => {
    Annons.find()
        .then(annonser => res.json(annonser))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route('/find1/:id').get((req, res) => {
  const id = req.params.id;
  Annons.find( { "_id": ObjectId(id) } )
      .then(annonser => res.json(annonser))
      .catch(err => res.status(400).json("Error: " + err));
});

router.route('/find2/:province/:category').get((req, res) => {
  const province = req.params.province;
  const category = req.params.category;
  if (province === "Hela Sverige") {
    Annons.find( { "category" : category } )
    .then(annonser => res.json(annonser))
    .catch(err => res.status(400).json("Error: " + err));
  }
  else {
    Annons.find( { "province": province, "category" : category } )
    .then(annonser => res.json(annonser))
    .catch(err => res.status(400).json("Error: " + err));
  }

});


router.route('/title').get((req, res) => {
  Annons.find({}, {title:1, _id:0})
      .then(titles => res.json(titles))
      .catch(err => res.status(400).json("Error: " + err));
});

router.route('/title/:searchword').get((req, res) => {
  const searchword = req.params.searchword;
  Annons.find({title: { '$regex' : searchword, '$options' : 'i' } })
      .then(titles => res.json(titles))
      .catch(err => res.status(400).json("Error: " + err));
});

router.post('/add', upload.single('annonsImage'), (req, res) => {

    const annonsID = req.file.id;

    const imageURL = "https://begtool-backend.herokuapp.com/image/" + req.file.filename;
    const name = req.body.name;
    const email = req.body.email;
    const emailCheck = req.body.emailCheck;
    const phone = req.body.phone;
    const province = req.body.province;
    const area = req.body.area;
    const zipCode = req.body.zipCode;
    const title = req.body.title;
    const category = req.body.category;
    const description = req.body.description;
    const imageID = req.file.filename;
    const price = req.body.price;


    const newAnnons = new Annons({
        name,
        email,
        emailCheck,
        phone,
        province, 
        area,
        category,
        zipCode,
        title,
        description,
        imageID,
        imageURL,
        price,
    });
    newAnnons.save()
        .then(() => {
          const response = {
            success: true,
            annonsID: annonsID
          }
          res.json(response)
          
        }
)
        .catch(err => res.status(400).json("Error: " + err));
});




module.exports = router;