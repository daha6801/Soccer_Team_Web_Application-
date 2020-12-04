var express = require('express');
var router = express.Router();

/* GET the map. */
router.get('/', function(req, res, next) {
  res.render('googlemaps', { title: 'Rashmi Dahal' });
});

module.exports = router;
