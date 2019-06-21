//var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');
var session=require('express-session');
var config=require('config-lite')(__dirname);
var MongoStore=require('connect-mongo')(session);
var flash=require('connect-flash');
var pkg=require('./package');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var routes=require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    name:config.session.key,
    secret:config.session.secret,
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:config.session.maxAge
    },
    store:new MongoStore({
        url:config.mongodb
    })
}));
app.use(flash());

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

routes(app);

app.listen(config.port,function () {
    console.log('${pkg.name} listening on port ${config.port}');
})