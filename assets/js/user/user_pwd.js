//入口函数
$(function() {
    //1.定义密码验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        //1.1所有密码验证规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //1.2新旧密码不能相同验证规则
        samePwd: function(value) {
            var v2 = $("[name=oldPwd]").val();
            if (value === v2) {
                return '新旧密码不能相同'
            }
        },
        //1.3新密码和确认密码不一致问题
        rePwd: function(value) {
            var v3 = $("[name=newPwd]").val();
            if (value !== v3) {
                return '两次输入密码不一致'
            }
        }
    })

    // 2.实现重置密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('密码修改失败！');
                }
                layer.msg('恭喜您，密码修改成功！');
                // console.log($('.layui-form'));
                //原生DOM方法，重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})