var express=require('express');
var PostModel=require('../models/posts');
var router=express.Router();

var checkLogin=require('../middlewares/check').checkLogin;

router.get('/',function (req,res,next) {
    /*res.render('posts',{
        blog:{
            title:'posts'
        }
    });*/
    var author=req.query.author
    PostModel.getPosts(author)
        .then(function (posts) {
            res.render('posts',{
                posts:posts
            })
        })
        .catch(next)
})

router.post('/create',checkLogin,function (req,res,next) {
    var author=req.session.user._id
    var title=req.field.title
    var content=req.field.content
    
    try{
        if(!title.length){
            throw new Error('请填写标题')
        }
        if (!content.length){
            throw new Error('请填写内容')
        }
    }catch (e) {
        req.flash('error',e.message)
        return res.redirect('back')
    }
    let post={
        author:author,
        title:title,
        content:content
    }
    PostModel.create(post)
        .then(function (result) {
            //此post是插入mongodb后的值，包含_id
            post=result.ops[0]
            req.flash('success','发表成功')
            res.redirect('/posts/${post._id')
        })
        .catch(next)
})

router.get('/create',checkLogin,function (req,res,next) {
    res.render('create');
})

router.get('/:postId',function (req,res,next) {
    res.send('文章详情页');
})

router.get('/:postId/edit',checkLogin,function (req,res,next) {
    res.send('更新文章页');
})

router.post('/:postId/edit',checkLogin,function (req,res,next) {
    res.send('更新文章');
})

router.get('/:postId/remove',checkLogin,function (req,res,next) {
    res.send('删除文章');
})

module.exports=router;