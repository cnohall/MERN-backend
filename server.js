const express = require ('express');
const cors = require ('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const annonsRouter = require('./routes/annonser.js'); 
const mailRouter = require('./routes/mail.js'); 
const Grid = require('gridfs-stream');
const Annons = require('./models/annons.model');
const ObjectId = require('mongodb').ObjectID;



const app = express ();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const password = process.env.ATLAS_PASSWORD;
const ATLAS_URI = "mongodb+srv://cnohall:" + password+ "@advertdata-bukei.mongodb.net/test?retryWrites=true&w=majority"
// process.env.MONGODB_URI

const conn = mongoose.createConnection(ATLAS_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});



mongoose.connect(ATLAS_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const db = mongoose.connection;


conn.once('open', () => {


    // gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    //     bucketName: "uploads"
    //   });
      
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')

    console.log('Picture Connection Successful')
})

app.get('/', function(req, res){
    res.redirect('/annons');
 });

app.get('/uploads', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            })
        }
  
        return res.json(files);
    })
});

app.get("/files/del/:fileID/:imageID", (req, res) => {
    gfs.remove({_id: req.params.fileID, root: 'uploads'}, (err, data) => {
      if (err) return res.status(404).json({ err: err.message });
    });
    Annons.deleteOne( {imageID: req.params.imageID}).then(x => {
        console.log(x);
        return res.send("Din annons är nu nedtagen")
      })
      .catch(err => res.status(400).json("Error: " + err));
});


app.get('/uploads/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file)=> {
        if(!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            })
        }
        return res.json(file)
    });
});

app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file)=> {
        if(!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            })
        }
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res)
        } else {
            return res.status(404).json({
                err: 'Not an image'
            })
        }
    });
});


// app.get('/deleteOlder', (req, res) =>{
//     Annons.deleteMany( { orderExpDate : {"$lt" : new Date(Date.now() - 1*24*60*60 * 1000) } }).then(x => {
//         res.json("deleted all posts older than 1 day")
//         console.log(x)
//       })
//       .catch(err => res.status(400).json("Error: " + err));
// })

app.use('/annons', annonsRouter);
app.use('/mail', mailRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});




