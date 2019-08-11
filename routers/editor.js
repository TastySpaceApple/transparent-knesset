const express = require('express');
const db = require('../services/db')

const router = express.Router();

router.get('/meetings', (req, res) => {
  db.getMeetings().then(meetings => {
    res.render('edit-meetings', {meetings})
  })
});

router.post('/update_meeting', (req, res) => {
  db.addOrUpdateMeeting(req.body).then(() => res.send({success:true}));
});


module.exports = router;
