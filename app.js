console.log('[app.js] Starting application...');
console.log('[app.js] Current server time: ' + new Date().toString());

// process.env.PORT = process.env.PORT || 80;
console.log('[app.js] Listening port: ' + process.env.PORT);

// Require JS imports
console.log('[app.js] Importing modules...');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');

var mongoDBHost = process.env.MONGOSTR || 'mongodb://localhost:27017/chirp-test';

console.log('[app.js] Opening Mongoose connection to: \'' + mongoDBHost + '\'');
mongoose.connect(mongoDBHost);

console.log('[app.js] Importing Mongoose Model schemas...');
var models = require('./models/models');

// ExpressJS routings
console.log('[app.js] Importing custom Express routers...');
var api = require('./routes/api');
var auth = require('./routes/auth')(passport);
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'CodeLab@BWSC.co');
  return next();
}); 

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  secret: 'ASECRET',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// Make node_modules accessible to the public.

app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use('/node_modules/bootstrap/dist/css/less/', express.static(path.join(__dirname, 'node_modules/bootstrap/less/')));
app.use('/node_modules/bootstrap/dist/css/dist/css/', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css/')));

console.log('[app.js] Importing Passport.js configuration module...');
var initializePassport = require('./config/passport');
initializePassport(passport);

console.log('[app.js] Configuring routing...');
app.use('/', index);
app.use('/api', api);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
