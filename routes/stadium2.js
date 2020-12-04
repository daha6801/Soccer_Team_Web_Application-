var express = require('express');
var router = express.Router();

//var polymer = require('/bower_components/polymer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('stadium2', { title: 'Rashmi Dahal' });
});

module.exports = router;