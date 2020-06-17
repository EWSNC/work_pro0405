$(function () {
    bindEvent();
    loadUserInfo();
    checkLogin();
});

//绑定事件
function bindEvent() {
    $("#loginbtn").bind("click", function () {
        login0();
    });
    $("#password").bind("click", function () {
        $("#password").attr("passwordType", "0");
    });
}

//登陆
function login0() {
    var username = $("#username").val();
    var password = $("#password").val();
    var passwordType = $("#password").attr("passwordType");
    var rember = $('#logincheckbox').is(":checked") ? 1 : 0;
    var data = {
        username: username,
        password: password,
        passwordType: passwordType,
        rember: rember
    };
    var cbSuccess = function (res) {
        if (rember) {
            //记住密码
            var outPwd = res.data.outPwd;
            var d = {usr: username, pwd: outPwd};
            var str = JSON.stringify(d);
            $.cookie('userinfo', str, {expires: 30});
        } else {
            $.cookie('userinfo', null);
        }
        window.location.href = "index.html";

    };
    var cbFailed = function (res) {
        CustumCommonUtil.showMsg(res.result)
    };
    CommonRemote.login.login(data, cbSuccess, cbFailed);
}

//回车键登录
function checkLogin() {
    $(document).keydown(function () {
        if (event.keyCode == 13) {//回车键的键值为13
            login0();
        }
    });
}


function loadUserInfo() {
    var d = $.cookie('userinfo');
    if (d != null) {
        var userinfo = JSON.parse(d);
        $('#username').val(userinfo.usr);
        $("#password").val(userinfo.pwd);
        $("#password").attr("passwordType", "1");
        $("#logincheckbox").prop("checked", true);
        //$("input[name='logincheckbox']").prop("checked", true);
    }
}