//Third party packeges
const express = require('express');
const router = express.Router();


const interFace = require('../models/interFace')

router.post('/voice', async (req, res) => {
    res.send(req.body)      
})

router.get('/voice', async (req, res) => {
    interFace.find()
    .then(interFaces => {
        res.send(interFaces[0])
    })
})

module.exports = router;