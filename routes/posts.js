var express=require('express');
var PostModel=require('../models/posts');
var CommentModel=require('../models/comments');
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
                posts:posts,
                blog:{
                    title: 'posts'
                }
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
    var postId=req.param.postId
    Promise.all([
        PostModel.getPostById(postId),//获取文章信息
        PostModel.getComments(postId),//获取文章下所有留言
        PostModel.incpv(postId) //pv+1
    ])
        .then(function (result) {
            var post=result[0]
            var comments=result[1]
            if(!post){
                throw new Error('该文章不存在')
            }
            res.render('post',{
                post:post,
                comments:comments
            })
        })
        .catch(next)
})

router.get('/:postId/edit',checkLogin,function (req,res,next) {
    var postId=req.params.postId
    var author=req.session.user._id
    PostModel.getRawoistById(postId)
        .then(function (post) {
            if(!post){
                throw new Error('该文章不存在')
            }
            if(author.toString()!==post.author._id.toString()){
                throw new Error('权限不足')
            }
            res.render('edit',{
                post:post
            })
        })
        .catch(next)
})

router.post('/:postId/edit',checkLogin,function (req,res,next) {
    var postId=req.params.postId
    var author=req.session.user._id
    var title=req.fields.title
    var content=req.fields.content

    try{
        if(!title.length){
            throw new Error('请填写标题')
        }
        if(!content.length){
            throw new Error('请填写内容')
        }
    }catch (e) {
        req.flash('error',e.message)
        return res.redirect('back')
    }
    PostModel.getRawoistById(postId)
        .then(function (post) {
            if(!post){
                throw new Error('文章不存在')
            }
            if(post.author._id.toString()!==author.toString()){
                throw new Error('没有权限')
            }
            PostModel.updatePostById(postId,{title:title,content:content})
                .then(function () {
                    req.flash('success','编辑文章成功')
                    res.redirect('/post/${postId}')
                })
                .catch(next)
        })
})

router.get('/:postId/remove',checkLogin,function (req,res,next) {
    var postId=req.params.postId
    var author=req.session.user._id
    PostModel.getRawoistById(postId)
        .then(function (post) {
            if(!post){
                throw new Error('该文章不存在')
            }
            if(post.author._id.toString()!==author.toString()){
                throw new Error('没有权限')
            }
            PostModel.delPostById(postId)
                .then(function () {
                    req.flash('success','删除成功')
                    res.redirect('/posts')
                })
                .catch(next)
        })
})

module.exports=router;