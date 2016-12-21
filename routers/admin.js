/**
 * 后台模块
 */

var express=require('express');
var router=express.Router();
var User=require('../models/User');
var Category=require('../models/Category');
var Content=require('../models/Content');

router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send("对不起，只有管理员可以进入");
        return ;
    }
    next();
});

//后台管理
router.get("/",function(req,res){
    res.render('admin/index.html');
});

//用户管理列表
router.get("/user",function(req,res){
    /**
     * 从数据库中读取用户的数据
     * limit(number) 限制数据库读取数据的条数
     * skip(2):忽略数据的条数
     * 
     * 没有显示两条
     * 1 1-2 skip ：0->(当前页面－1)＊limit
     * 2 3-4 skip ：2
     * 
    */

    /**
     * 查用总页数
     */

    var page=Number(req.query.page || 1);
    var limit=2;
    var pages=0;
    User.count().then(function(count){
        //计算总页数,向上取整
        pages=Math.ceil(count/limit);
       
         //取值不能超过pages
        page=Math.min(page,pages);
        //取值不能小于1
        page=Math.max(page,1);
        var skip=(page-1)*limit;
        
        User.find().limit(limit).skip(skip).then(function(users){
            console.log(users);
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                limit:limit,
                url:'/admin/user',
                pages:pages,
                count:count,
                page:page
            });
    });
    });
});

//分类管理列表
router.get('/category',function(req,res){
    var page=Number(req.query.page || 1);
    var limit=2;
    var pages=0;
    Category.count().then(function(count){
        pages=Math.ceil(count/limit);
        //最小不能小于1
         page=Math.max(page,1);
        //最大不能大于总页数
        page=Math.min(page,pages);
        var skip=(page-1)*limit;
        
        /**
         * 1:身序
         * －1：降序
         */
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
            res.render('admin/category',{
                userInfo:req.userInfo,
                categories:categories,
                limit:limit,
                url:'/admin/category',
                count:count,
                page:page,
                pages:pages
            });
        });
    });
});

//添加分类
router.get('/category/add',function(req,res){
    res.render('admin/category_add');

});

/**
 * 分类的保存
 */
router.post('/category/add',function(req,res){
     var name=req.body.name || '';
     console.log(name);
     if(name==''){
         res.render('admin/error',{
             userInfo:req.userInfo,
             message:'名称不能为空'
         });
         return;
     }
     
     
     //数据库中是否存在同名的分类名称
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            //数据库中已经存在改分类
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已经存在了'
            });
            return Promise.reject();
        }else{
            //数据库中不存在该分类
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        });
    });


});

/**
 * 分类修改
 */
router.get('/category/edit',function(req,res){
    //获取要修改的分类信息
     var id=req.query.id || '';
     //获取要修改的分类信息
     Category.findOne({
         _id:id
     }).then(function(category){
         if(!category){
             res.render('admin/error',{
                 userInfo:req.userInfo,
                 message:'分类信息不存在',
             });
         }else{
             res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
             });
         }
     });
});

/**
 * 保存修改的分类
 */
router.post('/category/edit',function(req,res){
     var id=req.query.id 
     var name=req.body.name || '';
     if(!name){
         req.render('admin/error',{
             userInfo:userInfo,
             message:'修改的名称不能为空'
         });
     }else{
        
         //获取当前修改的分类信息
         Category.findOne({
             _id:id
         }).then(function(category){
             if(!category){
                 res.render('admin/error',{
                     userInfo:req.userInfo,
                     message:'分类信息不存在'
                 });
                 return Promise.reject();
             }else{
                 //当前用户没用做任何修改
                 if(name==category.name){
                     res.render('admin/success',{
                         userInfo:req.userInfo,
                         message:'修改成功',
                         url:'/admin/category'
                     });
                     return Promise.reject();
                 }else{

                     //要修改的分类名在数据库中存在
                     return Category.findOne({
                         _id:{$ne:id},
                         name:name
                     });
                 }
             }
         }).then(function(sameCategory){
             if(sameCategory){
                 res.render('admin/error',{
                     userInfo:req.userInfo,
                     message:' 数据库中已经存在同名分类'
                 });
                 return Promise.reject();
             }else{
                 return Category.update({
                     _id:id
                 },{
                     name:name
                 });
             }
         }).then(function(){
             res.render('admin/success',{
                 userInfo:req.userInfo,
                 message:'修改成功',
                 url:'/admin/category'
             })
         });
     }
});

/**
 * 删除分类
 */
router.get('/category/delete',function(req,res){

    //获取要删除的id
    var id=req.query.id || '';

    Category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/category'
        });
    });

});


/**
 * 内容列表
 */
router.get('/content',function(req,res){

    var page=Number(req.query.page || 1);
    var limit=2;
    var pages=0;
    Content.count().then(function(count){
            pages=Math.ceil(count/limit);
            //最小不能小于1
            page=Math.max(page,1);
            //最大不能大于总页数
            page=Math.min(page,pages);
            var skip=(page-1)*limit;
            
            /**
             * 1:身序
             * －1：降序
             */
            Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
                res.render('admin/content',{
                    userInfo:req.userInfo,
                    contents:contents,
                    limit:limit,
                    url:'/admin/content',
                    count:count,
                    page:page,
                    pages:pages
                });
            });
        });
});

/**
 *  添加内容
 */
router.get('/content/add',function(req,res){

    //读取分类信息
    Category.find().sort({_id:-1}).then(function(categories){
        console.log(categories);
        res.render('admin/content_add',{
            categories:categories
        });
    });
    
});

/**
 * 添加内容的post
 */
router.post('/content/add',function(req,res){
    
   var category=req.body.category || '';
   var title=req.body.title || '';
   var description=req.body.description;
   var  content=req.body.content;
    
    //前端校验
    if(Category==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类不能为空'
        });
         return ;
    }

    if(title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
         return ;
    }

    console.log(req.userInfo.id);
    //保存到数据库
    new Content({
        category:category,
        title:title,
        user:req.userInfo.id.toString(),
        description:description,
        content:content
    }).save().then(function(content){
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'保存成功',
                url:'/admin/content'
            });
    });
    
});

/**
 * 修改内容
 */
router.get('/content/edit',function(req,res){
    var id=req.query.id || '';

    var categories=[];
    //查分类信息
    Category.find().then(function(cs){
        categories=cs;
        return  Content.findOne({
          _id:id
         }).populate('category');
    }).then(function(content){

        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'指定的内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                categories:categories,
                content:content
            });
        }
    });
});

/**
 * 保存内容的修改
 */
router.post('/content/edit',function(req,res){
    var id=req.query.id || '';

    if(req.body.category==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        });
        return;
    }

    if(req.body.title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return ;
    }

    //两个参数，第一个表示条件，第二个是修改的内容
    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function(content){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/content'
        });
    });

});

/**
 * 删除
 */
router.get('/content/delete',function(req,res){
    var id=req.query.id || '';
    Content.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"删除成功",
            url:'/admin/content'
        });
    });
});
module.exports=router;