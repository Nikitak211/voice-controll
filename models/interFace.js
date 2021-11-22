const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema creater and models

const interFace = new Schema({
    name: {
        type: String
    }
});

const interFacedata = mongoose.model('commands', interFace);

module.exports = interFacedata;
