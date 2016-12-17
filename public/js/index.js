$(function(){
    var $loginBox=$('#loginBox ');
    var $registerBox=$('#registerBox');
    var $logout=$('#logout');

    //切换到注册面板
    $loginBox.find('a.colMint').on('click',function(){
        $registerBox.show();
        $loginBox.hide();
    });

    //切换到登录面板
    $registerBox.find('a.colMint').on('click',function(){
        $loginBox.show();
        $registerBox.hide();
    });

    //注册
    $registerBox.find('input[type="button"]').on('click',function(){
         //通过ajax提交请求
         $.ajax({
             type:'post',
             url:'/api/user/register',
             data:{
                 username:$registerBox.find("#username").val(),
                 password:$registerBox.find("#pwd").val(),
                 repassword:$registerBox.find("#repwd").val()
             },
             dataType:'json',
             success:function(result){
               $("#colMessage").html(result.message);
               if(result.code==0){
                   setTimeout(function(){
                       $loginBox.show();
                        $registerBox.hide();
                   },1000)
               }
             }
         });
    });

    //登录
    $loginBox.find('input[type="button"]').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find("#loginName").val(),
                password:$loginBox.find("#loginPwd").val()
            },
            dataType:'json',
            success:function(data){
                if(data.code==0){
                    window.location.reload();
                   // $loginBox.hide();
                   // $loginSuccess.show();
                   // $loginSuccess.find('p').html(data.userInfo.username+'登录成功');
                }else{
                     $loginBox.find('.colMessage').html(data.message);     
                }
            }
        });
    });

    //登出
    $logout.click(function(){
        $.ajax({
            type:'get',
            url:'/api/user/logout',
            success:function(data){
                if(data.code==0){
                  window.location.reload();
                }
            }
        });
    });

    //进入管理员界面
    $("#admin").on('click',function(req,res){
        $.ajax({
            type:'get',
            url:'/admin'
        });
    });


});