let db = require('../services/db');
const router = require('express').Router();
const http = require('http');
const path = require('path');

router.get('/', (req, res) => {
  res.json({ message: 'Connected!' });
});

router.get('/speeches', (req, res) => {
  let data = {}
  if('protocolId' in req.query) data['protocolId'] = req.query['protocolId'];
  if('speaker' in req.query) data['speaker'] = req.query['speaker'];

  db.getSpeeches(data)
    .then(speeches => res.json(speeches));
});

router.get('/meetings', (req, res) => {
  let data = {}
  if('protocolId' in req.query) data['protocolId'] = req.query['protocolId'];
  if('speaker' in req.query) data['speaker'] = req.query['speaker'];

  db.getSpeeches(data)
    .then(speeches => res.json(speeches));
});

var request = require('request');

router.get('/images/mk', (req,res) => {
  db.getMemberImageUrlByName(req.query.name).then(url => {
    request.get(url).pipe(res);
  }).catch(() => {
    res.sendFile(path.join(__dirname, 'img/noimage.png'));
  })
  //let url = 'http://fs.knesset.gov.il/globaldocs/MK/948/1_948_2_2596.png?v=20190722_62614';
  //request.get(url).pipe(res);
})


module.exports = router;
