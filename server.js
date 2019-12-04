const express = require ('express');
const cors = require ('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const advertRouter = require('./routes/adverts.js'); 
const mailRouter = require('./routes/mail.js'); 
const Grid = require('gridfs-stream');



const app = express ();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const password = process.env.ATLAS_PASSWORD;
const ATLAS_URI = "mongodb+srv://cnohall:" + password+ "@advertdata-bukei.mongodb.net/test?retryWrites=true&w=majority"
// process.env.MONGODB_URI

mongoose.connect(ATLAS_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
);

const connection = mongoose.connection;

connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo)
    gfs.collection('uploads')
    console.log('Picture Connection Successful')
    console.log("MongoDB database connection established successfully");
})

app.get('/', function(req, res){
    res.redirect('/adverts');
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

app.use('/adverts', advertRouter);
app.use('/mail', mailRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});




