/**
 * 应用程序启动入口
 */

   //引入express模块
   var express=require('express');
   //加载模板处理模块
   var  swig=require('swig');
   //加载数据库模块
   var mongoose=require('mongoose');
   //加载body-parser,用来处理post提交过来的数据
   var bodyParser=require('body-parser');
   //加载cookies模块
   var Cookies=require('cookies');
   //引入User模型类
   var User=require('./models/User.js');
   //创建app应用
   var app=express();


    /**
     * 使用模板引擎实现前后端分离
     */
   //配置应用模板
   //定义当前应用所使用的模板引擎
   //第一个参数：模板引擎的名称，同时也是模板文件的后缀
   //第二个参数表示用于解析处理模板内容的方法
   app.engine('html',swig.renderFile);
   //设置模板文件存放的目录
   //第一个参数必须是views,第二个参数是目录
   app.set('views','./views');
   //注册所使用的模板引擎
   //第一个参数必须是view engine
   //第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数是一致的）;
   app.set('view engine','html');
   //在开发过程中，需要取消模板缓存
   swig.setDefaults({cache:false});

    //bodyParser的配置
    app.use(bodyParser.urlencoded({ extended: true }));
    //设置cookie
    app.use(function(req,res,next){
      req.cookies=new Cookies(req,res);
      //解析登录用户的cookies信息
      req.userInfo={};
      if(req.cookies.get('userInfo')){
        try{
          req.userInfo=JSON.parse(req.cookies.get('userInfo'));
          User.findById(req.userInfo.id).then(function(userInfo){
            req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
            next();    
          });
        }catch(e){
          next();
        }
      }else{
        next();
      }
    });
   //模块开发，如果前后台代码都写在一起的话，这样的话，不利于管理
   /**
    * 根据不同的功能划分模块
    */
   app.use('/admin',require('./routers/admin'));
   app.use('/api',require('./routers/api'));
   app.use('/',require('./routers/main'));

   /**
    * 静态文件托管
    */
    app.use('/public',express.static(__dirname+'/public'));


  //连接数据库
  mongoose.connect('mongodb://localhost:27017/blog',function(err){
    console.log(err);
    if(err){
      console.log('数据库连接失败');
    }else{
      console.log('数据库连接成功');
    }
  });
    //监听http
  app.listen(3000);



   