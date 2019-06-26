var express=require('express');
var sha1=require('sha1');
var router=express.Router();

var UserModel=require('../models/users');
var checkNotLogin=require('../middlewares/check').checkNotLogin;

router.get('/',checkNotLogin,function (req,res,next) {
    res.render('signin',{
        blog:{
            title:'signin'
        }
    });
})

router.post('/',checkNotLogin,function (req,res,next) {
    var name=req.fields.name;
    var password=req.fields.password;

    //效验参数
    try{
        if(!name.length){
            throw new Error('请填写用户名')
        }
        if(!password.length){
            throw new Error('请填写密码')
        }
    }catch (e) {
        req.flash('error',e.message)
        return res.redirect('back')
    }
    UserModel.getUserByName(name)
        .then(function (user) {
            if(!user){
                req.flash('error','用户名不存在')
                return res.redirect('back')
            }
            //检查密码匹配
            if(sha1(password)!==user.password){
                req.flash('error','用户名或密码错误')
                return res.redirect('back')
            }
            req.flash('success','登录成功')
            //用户信息写入session
            delete  user.password;
            req.session.user=user;
            res.redirect('/posts');
        })
        .catch(next)
})

module.exports=router;