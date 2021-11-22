//Third party packeges
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// require packege for the .env file
require('dotenv').config()


const AuthRoute = require('./routes/route')

// MongoDBUri form env file goes here.
const mongoDBUri = process.env.MONGODB_URI

mongoose.connect(mongoDBUri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

mongoose.connection.once('open', function () {
    console.log('connection is success!! ');
}).on('error', function (error) {
    console.log('***connection not available***', error);
});

const store = new MongoDBStore({
    uri: mongoDBUri,
    collection: process.env.DATABASE
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
})


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

//body parser Midware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/command/', AuthRoute )
app.use('/static', express.static(path.join(__dirname, 'src')))