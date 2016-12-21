/**
 * 首页模块
 */

var express=require('express');
var router=express.Router();
var Category=require('../models/Category');

router.get('/',function(req,res,next){

    //默认是以text/html的方式解析
    
    //获取分类信息
     Category.find().then(function(categories){
         res.render('main/main.html',{
            userInfo:req.userInfo,
            categories:categories
            });
     });
    
});   

module.exports=router;