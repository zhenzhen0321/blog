/**
 * Api模块
 */

var express=require('express');
var router=express.Router();
var User=require('../models/User.js')

//统一返回格式
var responseData;
    router.use(function(req,res,next){
        responseData={
            code:0,
            message:''
        }
        next();
    });
/**
 * 用户注册
 *   注册逻辑
 *   1.用户名不能为空
 *   2.密码不能为空
 *   3.两次输入密码必须一致
 * 
 *   1.用户名是否已经被注册
 *      数据库查询
 */
router.post('/user/register',function(req,res,next){
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;

    //用户是否为空
    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
    }
    //密码不能为空
    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
    }
    //两次输入的密码必须一致
    if(password!=repassword){
        responseData.code=3;
        responseData.message='两次输入的密码不一致';
        res.json(responseData);
        return;
    }
    
    //基于数据库的验证
    User.findOne({
       username:username
    }).then(function(userInfo){
        if(userInfo){
            //表示数据库中有该记录
            responseData.code=4;
            responseData.message='用户名存在';
            res.json(responseData);
            return;
        }

        //保存用户注册的信息到数据库中
        var user=new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function(newUserInfo){
         responseData.message='注册成功';
          res.json(responseData);
    });
});   

/**
 * 用户登陆
 */
router.post('/user/login',function(req,res){
    //判断用户是否存在
    var username=req.body.username;
    var password=req.body.password;
    
    //前端验证
    if(username=='' || password==''){
        responseData.code=1;
        responseData.message='用户名和密码不能为空';
        res.json(responseData);
        return ;
    }

    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(userInfo){
            responseData.message='登陆成功';
            responseData.userInfo={
                id:userInfo.id,
                username:userInfo.username
            }
            req.cookies.set('userInfo',JSON.stringify({
                id:userInfo.id,
                username:userInfo.username
            }));
            res.json(responseData);
        }else{
            responseData.message="用户名或者密码错误";
            responseData.code=2;
            res.json(responseData);
        }
    });


});

/**
 * 用户登出
 */
router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',{});
    responseData.message="登出成功";
    res.json(responseData);
});
module.exports=router;