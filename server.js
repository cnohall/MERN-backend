const express = require ('express');
const cors = require ('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const advertRouter = require('./routes/adverts.js'); 




const app = express ();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const password = process.env.ATLAS_PASSWORD;
console.log(password);
const ATLAS_URI = "mongodb+srv://cnohall:" + password + "@advertdata-bukei.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(ATLAS_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.use('/adverts', advertRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});




