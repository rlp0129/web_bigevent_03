$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    //1.获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取列表失败')
                }
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //2.为添加类别绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            // 弹出层类型，1代表页面层
            type: 1,
            // 设置弹出层宽高
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        })
    });
    //3.通过代理形式为form-add绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        // console.log('ok');
        //3.1发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //1.提示成功2.重新获取文章分类3.关闭添加区域
                initArtCateList();
                layer.msg('恭喜您，添加文章分类成功！');
                layer.close(indexAdd);
            }
        })
    });
    //4.通过代理形式为btn-edit绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#form-edit', function(e) {
        e.preventDefault();
        //弹出一个修改文章分类的层
        indexEdit = layer.open({
            // 弹出层类型，1代表页面层
            type: 1,
            // 设置弹出层宽高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        })
        var id = $(this).attr('data-id')
            //发起请求获取对应分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    });
    //5.通过代理形式为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg('恭喜您，文章类别更新成功！');
                layer.close(indexEdit);

            }
        })
    });
    //6.通过代理形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //6.1先获取Id，进入到函数中this代指就改变了
        var id = $(this).attr('data-id');
        //6.2显示对话框
        layer.confirm('是否确认删除?', {
            icon: 3,
            title: '提示'
        }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('恭喜您，文章类别删除成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })

        });
    })

})