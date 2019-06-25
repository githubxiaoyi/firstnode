var config=require('config-lite')(__dirname);
var Mongolass=require('mongolass');
var mongolass=new Mongolass();
mongolass.connect(config.mongodb);

exports.User=mongolass.model('User',{
    name:{type:'string',required:true},
    password:{type:'string',required:true},
    avatar:{type:'string',require:true},
    gender:{ type:'string',enum:['m,''f','x'],default:'x'},
    bio:{type:'string',required:true}
})
exports.User.index({name:1},{unique:true}).exec() //根据用户名找到用户 用户名唯一