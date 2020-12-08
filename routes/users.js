var express = require('express');
var router = express.Router();

const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require("../models/users");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', {title:'Users listing'});
});

router.get('/signup', (req, res) => {
  res.render('signup', {title:'Signup page!'});
});

router.post('/signup', catchAsync(async (req, res, next) => {
  try {
    const {email, username, password} = req.body;
    const user = new users({email, username});
    const registeredUser = await users.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Holben!');
      res.redirect('/staidum');
    })
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('signup');
  }
}));

router.get('/login', (req, res) => {
  res.render('login', {title:'Login page!'});
});

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: 'login'}), (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/stadium';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/stadium');
})

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
