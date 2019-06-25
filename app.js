//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
var session=require('express-session');
//var config=require('config-lite')(__dirname);
var config=require('./config/default');
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
//处理表单及文件上传的中间件
app.use(require('express-formidable')({
    upload:path.join(__dirname,'public/img'),//上传文件目录
    keepExtensions:true//保留后缀
}))


//app.use('/', indexRouter);
//app.use('/users', usersRouter);
//设置模板全局变量
app.locals.bolg={
    title:pkg.name,
    description:pkg.description
}
//添加模板必须的三个变量
app.use(function (req,res,next) {
    res.locals.user=req.session.user
    res.locals.success=req.flash('success').toString()
    res.locals.error=req.flash('error').toString()
    next()
})

routes(app);

module.exports=app;