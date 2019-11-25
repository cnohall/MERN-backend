const express = require ('express');
const cors = require ('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const advertRouter = require('./routes/adverts.js'); 




const app = express ();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const password = process.env.ATLAS_PASSWORD;
// const ATLAS_URI = "mongodb://cnohall:" + password + "@ds249717.mlab.com:49717/heroku_65w8w8q7";

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.get('/', function(req, res){
    res.redirect('/adverts');
 });

app.use('/adverts', advertRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});




