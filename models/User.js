/**
 * 模型类User,实现表结构的增删改成
 */

/**
 * 例子
 * var schema=new mongoose.Schema({name:'string',size:'string'})'
 * Tank是构造函数
 * var Tank=mongoose.model('Tank',schema);
 */

var mongoose=require('mongoose');
var usersSchema=require('../schemas/users');

//创建一个模型,用户对用户的表结构的操作
module.exports=mongoose.model('User',usersSchema);