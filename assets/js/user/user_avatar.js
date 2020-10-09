$(function() {
    // 1.获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.1 配置选项
    const options = {
        // 纵横比(指定裁剪框形状)
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.2 创建裁剪区域
    $image.cropper(options)


    //2.为上传按钮绑定点击事件
    //2.1选择图片
    $('#btnChooseImage').on('click', function() {
        $('#file').click();
    })

    //2.2修改图片 为文件选择框绑定change事件
    var layer = layui.layer;
    $('#file').on('change', function(e) {
            // console.log(e);
            // console.log(this.files);
            var filelist = e.target.files;
            if (filelist.length === 0) {
                return layer.msg('请选择图片')
            }
            //选择成功修改图片
            // 1. 拿到用户选择的文件
            var file = e.target.files[0]
                // 2. 将文件，转化为路径
            var imgURL = URL.createObjectURL(file)
                // 3. 重新初始化裁剪区域
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', imgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //3.为确定按钮绑定点击事件
    $('#btnUpload').on('click', function() {
        //3.1拿到裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');
        // console.log(dataURL);
        // console.log(typeof dataURL);
        //3.2掉用接口，将头像上传服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，上传头像成功');
                //刷新父页面头像
                window.parent.getUserInfo();
            }
        })
    })

    //4.渲染默认头像
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            //渲染用户头像
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', res.data.user_pic) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        },
    })
})