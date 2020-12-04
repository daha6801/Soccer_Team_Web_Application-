var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*const user = require('/models/users')
const ryu = new user ({
  name: 'Ryu',
  ultimate: 'Shinku Hadoken'
})

ryu.save(function (error, document) {
  if (error) console.error(error)
  console.log(document)
})*/

module.exports = router;
