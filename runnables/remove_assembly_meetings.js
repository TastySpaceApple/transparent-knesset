const db = require('../services/db');

db.removeMeetings({"committee":"מליאה"}).then(function(){
  console.log('done');
})
