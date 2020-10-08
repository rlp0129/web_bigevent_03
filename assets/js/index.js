$(function() {
        //1.获取用户信息
        getUserInfo();
        var layer = layui.layer;
        //3.退出登录功能
        $('#btnLogout').on('click', function() {
            // alert('ok');
            layer.confirm('确定退出登录?', {
                icon: 3,
                title: '提示'
            }, function(index) {
                //1.删除本地存储中的token
                localStorage.removeItem('token');
                //2.跳转到登录页面
                location.href = '/login.html';
                //layui自己提供的关闭询问框功能
                layer.close(index);
            });
        })
    })
    //获取用户信息封装函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            //渲染用户
            renderAvatar(res.data);
        },
        //不论成功失败都会触发complete方法
        // complete: function(res) {
        //     // console.log(res);
        //     //判断认证时失败跳转回登陆页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.删除本地token
        //         localStorage.removeItem('token');
        //         //2.页面跳转
        //         location.href = '/login.html';
        //     }
        // }
    })
}
//2.渲染用户
function renderAvatar(user) {
    //1.获取用户名
    var name = user.nickname || user.username;
    //2.渲染用户名
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    //3.渲染头像
    if (user.user_pic !== null) {
        //3.1渲染图片头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').show().html(first);
    }
}