$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 1.定义一个查询的参数对象，将来请求数据需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示数，默认每页显示两条
        cate_id: '', //文章分类的Id，默认为空
        state: '', //文章的发布状态，默认为空
    };
    //3.定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
    };
    // 4.在个位数的左侧填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initTable();
    initCate();
    // 2.获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg('恭喜您，获取文章列表成功！');
                // 2.1使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //渲染文章列表同时渲染分页
                renderPage(res.total);
            }
        })
    };
    //5.初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //5.1调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    };
    //6.为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //6.1获取表单中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //6.2为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //6.3初始化文章列表
        initTable();
    });

    //7.定义渲染分页方法(列表表格渲染完后才会调用渲染分页方法)
    function renderPage(total) {
        // console.log(total);
        // 7.1调用laypage.render方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示数据条数
            curr: q.pagenum, //默认被选中的分页
            //7.2.3
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 7.2分页发生切换时触发jump回调(obj是当前分页的所有选项值)
            // 解释:触发jump回调方式有两种:
            //第一种:点击页码值时会触发
            //第二种:只要调用了laypage.render()方法就会触发(发生了死循环)
            jump: function(obj, first) {
                //可以通过first的值来判断是哪种方式触发的jump回调，如果first值为true,证明是方式二触发，否则方式一
                // console.log(obj);
                // console.log(first); //undefined
                // console.log(obj.curr); //页码值
                //7.2.1 把最新的页码值赋值到q这个查询参数对象中pagenum属性中
                q.pagenum = obj.curr
                    //7.2.4把最新的条目数赋值给q这个查询参数对象中pagesize属性中
                q.pagesize = obj.limit
                    //7.2.2根据最新q查询参数中的值获取对应数据列表,并渲染表格
                    // initTable();
                if (!first) {
                    initTable();
                }
            }
        })
    };
    //8.通过代理行使为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // alert(ok);
        //8.3.1获取删除按钮个数
        var len = $('.btn-delete').length;
        // 8.2获取到文章id
        var id = $(this).attr('data-id');
        //8.1询问用户是否删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('恭喜您,删除文章成功!');
                    //8.3当数据删除完成后需要判断这一页是否还有剩余数据,如果没有就让页码值减1之后再重新调用initTable
                    if (len === 1) {
                        //如果len的值等于1就证明删除完毕之后,页面上就没有任何数据了
                        //减1前提:页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                }
            })
        })
    });



})