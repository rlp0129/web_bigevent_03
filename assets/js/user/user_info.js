$(function() {
    // 1.定义校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度为1~6个字符"
            }
        }
    });
    //2.初始用户信息
    initUserInfo();
    //初始化用户信息封装，后面还会用
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                // 成功后利用form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    //3.表单重置
    $('#btnReset').on('click', function(e) {
            //阻止表单默认重置
            e.preventDefault();
            // console.log(111);
            // 重新渲染
            initUserInfo();
        })
        //4.修改用户信息
    $('.layui-form').on('submit', function(e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！');
                }
                layer.msg('恭喜您，修改用户信息成功');
                window.parent.getUserInfo();
            }
        })
    })
})