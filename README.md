# 1.fast-init
构建package.json的工具
npm install -g fast-init

# 2.express
###

npm install express --save
npm i -S express

npm install express --save-dev
npm i -D express
脚手架工具的安装
npm install -g  express-generator

目录结构
  db  数据库存储目录
  models  数据库模块文件目录
  node_modules  node第三方模块目录
  public  公共文件目录
  routers  路由文件目录
  schemas  数据库结构文件目录
  views    模块视图文件目录
  app.js   应该启动该入口文件
  package.json  包依赖管理文件


技术点
    *node请求服务器的时候，会自动把请求主机及域名带着
    *node处理整个http请求的过程
      用户发送http请求->url->解析路由->找到匹配的规则->执行指定的绑定函数，返回对应的内容到用户 

分模块开发
     前台模块
     后台管理模块
     API模块     相当我们的ajax      