var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'World of Bomb-a-nation', 
  	motivation: 'WELCOME!' });
});

module.exports = router;
