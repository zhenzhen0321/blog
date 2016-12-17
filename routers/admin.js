/**
 * 后台模块
 */

var express=require('express');
var router=express.Router();

router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send("对不起，只有管理员可以进入");
    }
    next();
});

router.get("/",function(req,res){
    res.send("进入管理员首页");
})
module.exports=router;