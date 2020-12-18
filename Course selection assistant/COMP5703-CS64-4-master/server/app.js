var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter=require('./routes/admin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'session_login',
  secret: 'hsjfkfmeflsjvcxivjergergmaevdosfadisxczivemrglmerl',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 3600 * 1000},
  //rolling:true,
  store: new MongoStore({
    url: 'mongodb://localhost:27017/db',
  })
}));

app.get('/test_session', function (req, res) {
  if(req.session.isVisit) {
    req.session.isVisit++;
    res.send(req.session.isVisit+" times");
  } else {
    req.session.isVisit = 1;
    res.send('First time');
  }
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/db');
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));

db.once('open',function(callback) {
  console.log('db is open');
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

app.listen(5000);
module.exports = app;
