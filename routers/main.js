/**
 * 首页模块
 */

var express=require('express');
var router=express.Router();

router.get('/',function(req,res,next){
    console.log(req.userInfo);
    //默认是以text/html的方式解析
    res.render('main/main.html',{
        userInfo:req.userInfo
    });
});   

module.exports=router;