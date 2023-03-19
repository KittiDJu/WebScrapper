var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise
mongoose.connect("mongodb+srv://admin:25453212@projectcluster.gevdkpq.mongodb.net/ScraperDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "ScraperDB"
})
        .then(() => console.log('connection successful'))
        .catch((err) => console.error(err))

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const authors = require('./routes/authors');
const articles = require('./routes/articles');
const scraper = require('./routes/scraper');

const { resourceUsage } = require('process');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use('/authors', authors);
app.use('/articles', articles);
app.use('/scraper', scraper);

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
