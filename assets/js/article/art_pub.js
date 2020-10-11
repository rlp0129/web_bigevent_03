$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();
    //1.定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //1.1调用模板引擎渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    };
    //2.
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //3.为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });
    //4.监听coverFile的change事件,获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        //4.1获取到文件的列表数组
        var file = e.target.files[0];
        //4.2判断用户是否选择了文件
        if (file == undefined) {
            return layer.msg('请选择文件')
        }
        //4.3根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        //4.4先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });


    //5.定义文章的发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    //6.为表单提交submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        //6.1基于form表单快速创建FormData对象
        var fd = new FormData($(this)[0]);
        //6.2将文章的发布状态存到fd中
        fd.append('state', art_state);
        //6.3将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //6.4将文件对象存储到fd中
                fd.append('cover_img', blob);
                //6.5发起ajax请求
                publishArticle(fd);
            });


    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //FormData类型数据提交需要设置两个false
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您,添加文章成功,跳转中...');
                // 跳转
                // location.href = "/article/art_list.html"
                //去除bug
                setTimeout(function() {
                    window.parent.document.querySelector('#art_list').click();
                }, 2000)

            }
        })
    }

})