const express = require("express");
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

//import routes
const routes = require('./routes');
// index il citeste si fara sa il mai pun

app.use(routes);

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
                { useNewUrlParser: true },
                () => {
                console.log('Connected to DB. Iei.')
})

//listening to the server
app.listen(4000, () => {console.log("Srv started")})
