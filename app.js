var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var squadRouter = require('./routes/squad');
var stadiumRouter = require('./routes/stadium');
var stadium2Router = require('./routes/stadium2');
var user = require('./models/users');
//var login = require('auth/login');
//var signup = require('auth/signup');

/*
// Test code to insert documents to the mongodatabase
const insertDocuments = function(collection, callback) {
  // Get the documents collection
  //const collection = db.collection('mytestCollection');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb+srv://user:P@ssw0rd@cluster0.4gkkd.mongodb.net/mytestDatabase?retryWrites=true&w=majority';
 
// Database Name
const dbName = 'mytestDatabase';
 
const client = new MongoClient(url, { useNewUrlParser: true });
client.connect(err => {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const collection = client.db("mytestDatabase").collection("mytestCollection");
  //const db = client.db(dbName);
 
  insertDocuments(collection, function() {
    client.close();
  });
});*/

// Connecting to the database using mongooose
const url = 'mongodb+srv://user:P@ssw0rd@cluster0.4gkkd.mongodb.net/mytestDatabase?retryWrites=true&w=majority'

mongoose.connect(url, { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
  
});

const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected:', url)
});

db.on('error', err => {
  console.error('connection error:', err)
});

const sessionConfig = {
  secret: 'Nullaquisloremutlibro',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

var app = express();

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use('/', indexRouter);
app.use('/squad', squadRouter);
app.use('/users', usersRouter);
app.use('/stadium', stadiumRouter);
app.use('/stadium2', stadium2Router);
app.use('/models', user);
/*app.use('auth/login', login);
app.use('auth/signup', signup);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
