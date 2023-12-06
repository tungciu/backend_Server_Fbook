var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require("cors");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const _Authermiddalwera = require("./Connect/_AutherMiddalwera");
var Category = require('./routes/Category');
var usersRouter = require('./routes/users');
var AdminRouter = require('./routes/Admin.router');
var UsersRouter = require('./routes/User.router');
var BooksRouter = require('./routes/Book.router');
var CartRouter = require('./routes/Cart.router');
var BillRouter = require('./routes/Bill.router');
var AcountRouter = require('./routes/login.router');
var FavoriteRouter = require('./routes/Favorite.router');
var app = express();
// app.use('/uploads', express.static('public/uploads'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Cấu hình cors
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// các router
app.use('/acount', AcountRouter);
// app.use(_Authermiddalwera.isAuth);// check token
app.use('/Category', Category);
app.use('/users', usersRouter);
app.use('/admin',AdminRouter);
app.use('/user',UsersRouter);
app.use('/book',BooksRouter);
app.use('/cart',CartRouter);
app.use('/bill',BillRouter);
app.use('/Favorite',FavoriteRouter);
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
