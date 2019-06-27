var config=require('config-lite')(__dirname);
var Mongolass=require('mongolass');
var mongolass=new Mongolass();
var moment=require('moment');
var objectIdToTimestamp=require('objectid-to-timestamp');
mongolass.connect(config.mongodb);


exports.User=mongolass.model('User',{
    name:{type:'string',required:true},
    password:{type:'string',required:true},
    avatar:{type:'string',require:true},
    gender:{ type:'string',enum:['m,','f','x'],default:'x'},
    bio:{type:'string',required:true}
})
mongolass.plugin('addCreateAt',{
    afterFind:function (results) {
        results.forEach(function (item) {
            item.create_at=moment(objectIdToTimestamp(item._id).format('YYYY-MM-DD HH:mm'))
        })
        return results
    },
    afterFindOne:function (result) {
        if(result){
            result.created_at=moment(objectIdToTimestamp(result._id).format('YYYY-MM-DD HH:mm'))
        }
        return result;
    }
})

exports.User.index({name:1},{unique:true}).exec() //根据用户名找到用户 用户名唯一

exports.Post=mongolass.model('Post',{
    author:{type:Mongolass.Types.ObjectId,require:true},
    title:{type:'string',require:true},
    content:{type:'string',require:true},
    pv:{type:'number',default:0}
})
exports.Post.index({author:1,_id:-1}).exec()//按创建时间降序查询文章列表

