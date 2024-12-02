const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', async (req, res) => {
    res.send('Server is runing!!!');
})

module.exports = router