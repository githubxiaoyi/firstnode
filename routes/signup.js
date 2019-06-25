var express=require('express');
var router=express.Router();

var checkNotLogin=require('../middlewares/check').checkNotLogin;

router.get('/',checkNotLogin,function (req,res,next) {
    res.render('signup');
})

router.post('/',checkNotLogin,function (req,res,next) {
    res.send('注册');
})

module.exports=router;