
/**
 * 应用程序启动入口
 */

   //引入express模块
   var express=require('express');
   //加载模板处理模块
   var  swig=require('swig');
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



   //路由绑定
   /**
    * 首页
      req request对象
      res response对象
    */
    app.get('/',function(req,res){
        /**
         * 读取view目录下的指定文件，解析并返回客户端
         * 第一个参数表示模板文件,相对于view来的
         * 第二个参数是传给模板的数据
         * 
         */
          //注意使用模板读取模板的时候，
          //模板为了解决性能上的问题,
          //第一次读取的时候就会缓存，所以模板文件修改了
          //，必须重启服务器才能看到更新
          //第一个参数表示文件名称，是想对views目录下来的路径,
          //第二个参数表示传递给模板的数据
        res.render('index');

    });

    //静态文件请求处理
    // app.get('/main.css',function(req,res,next){
    //             res.setHeader('content-type','text/css');
    //             res.send('body {background:red}')
    // });
    //如果这样写的话，那么静态文件请求精要写很多。

    //express提供了静态文件托管的方法
    //设置静态文件托管
    //当用户访问的url以public开始，那么直接返回对应的__dirname+'/public'下的文件
    app.use('/public',express.static(__dirname+'/public'));

    // 用户发送http请求->url->解析路由->找到匹配的规则->执行指定的绑定函数，返回对应的内容到用户 
    /*public->静态->直接读取指定目录下的文件,返回给用户
      ->动态->处理业务逻辑，解析模板->返回数据给用户
     */



    //监听http
    app.listen(3000);



   