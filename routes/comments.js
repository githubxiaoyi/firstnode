var express=require('express');
var router=express.Router();
var checkLogin=require('../middlewares/check').checkLogin;
var CommentModel=require('../models/comments')

//创建一条留言
router.post('/',checkLogin,function (req,res,next) {
    var author=req.session.user._id
    var postId=req.fields.postId
    var content=req.fields.content

    try{
        if(!content.length){
            throw new Error('请填写留言内容')
        }
    }catch (e) {
        req.flash('error',e.message)
        return res.redirect('back')
    }
    var comment={
        author:author,
        postId:postId,
        content:content
    }
    CommentModel.create(comment)
        .then(function () {
            req.flash('success','留言成功')
            res.redirect('back')
        })
        .catch(next)
})
//删除一条留言
router.get('/:commentId/remove',checkLogin,function (req,res,next) {
    var commentId=req.params.commentId
    var author=req.session.user._id
    CommentModel.getCommentById(commentId)
        .then(function (comment) {
            if (!comment){
                throw new Error('留言不存在')
            } 
            if (comment.author.toString()!==author.toString()){
                throw new Error('没有权限删除留言')
            }
            CommentModel.delCommentsByPostId(commentId)
                .then(function () {
                    req.flash('success','删除成功')
                    res.redirect('back')
                })
                .catch(next)
        })
})
module.exports=router;
