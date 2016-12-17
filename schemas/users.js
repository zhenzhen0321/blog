/**
 * 数据库表模块
 */
var mongoose=require('mongoose');
//mongoose下面的Schema的构造函数，每次new一个代表着一个表
// var Schema=mongoose.Schema;

//用户的表结构
module.exports=new  mongoose.Schema({
     //用户名
     username:String,
     //密码
     password:String,
     isAdmin:{
         type:Boolean,
         default:false
     }
})