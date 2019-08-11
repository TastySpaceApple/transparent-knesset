const express = require('express');
const db = require('../services/db')

const router = express.Router();

router.get('/', (req, res) => {
  db.getMeetings().then(meetings => {
    res.render('meetings', {meetings})
  })
});

module.exports = router;
