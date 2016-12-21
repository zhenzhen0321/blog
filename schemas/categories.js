/**
 * 分类表
 */

var mongoose=require('mongoose');

//分类结构
module.exports=new mongoose.Schema({
    //分类名称
    name:String
});