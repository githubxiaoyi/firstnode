var express=require('express');
var router=express.Router();

var checkNotLogin=require('../middlewares/check').checkNotLogin;

router.get('/',checkNotLogin,function (req,res,next) {
    res.send('登录页');
})

router.post('/',checkNotLogin,function (req,res,next) {
    res.send('登录');
})

module.exports=router;