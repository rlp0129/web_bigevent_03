// 开发环境服务器地址
var baseURL = "http://ajax.frontend.itheima.net";
// 测试环境服务器地址
// var baseURL = "http://ajax.frontend.itheima.net";
// 生产环境服务器地址
// var baseURL = "http://ajax.frontend.itheima.net";
//1.拦截所有ajax请求
$.ajaxPrefilter(function(options) {
    // alert(options.url);
    // 拼接对应环境的服务器地址
    options.url = baseURL + options.url;
    // alert(options.url);

    //2.统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //3.登录拦截
    options.complete = function(res) {
        console.log(res);
        // console.log(res);
        //     //判断认证时失败跳转回登陆页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.删除本地token
            localStorage.removeItem('token');
            //2.页面跳转
            location.href = '/login.html';
        }
    }
})