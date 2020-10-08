$(function() {
    // 1点击去注册账号的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
    console.log(layui);
    // 2.通过 form.verify() 函数自定义校验规则
    form.verify({
            // 自定义了一个叫做 pwd 校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            // 定义重复密码规则
            repwd: function(value) {
                // 通过形参拿到的是确认密码框中内容，还需要拿到密码框中的内容，然后进行等于的判断
                // 如果判断失败,则return一个提示消息即可
                var pwd = $('.reg-box [name=password]').val()
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })
        //3.监听注册表单提交事件
    $("#form_reg").on("submit", function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/api/reguser',
                data: {
                    username: $(".reg-box [name=username]").val(),
                    password: $(".reg-box [name=password]").val(),
                },
                success: function(res) {
                    console.log(res);
                    // 判断状态
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                        // $('.layui-input').val('');
                    }
                    layer.msg('恭喜您，注册用户成功')
                        //手动触发a链接的切换功能
                    $("#link_login").click();
                }
            })
        })
        // 4.登录功能，给form标签绑定事件，button按钮触发提交事件
    $("#form_login").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                // 校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 提示信息，保存token，跳转页面
                layer.msg("恭喜您，登陆成功");
                localStorage.setItem("token", res.token);
                // 跳转页面
                location.href = "/index.html";
            }

        })
    })
})