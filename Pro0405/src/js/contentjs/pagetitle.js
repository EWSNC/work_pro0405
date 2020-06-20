/*
*
*页面头js
*   初始化服务器时间    系统名称
* */
$(function () {
    bindEvent();
    var webTitle = CommonRemote.getProperty("web.title");
    if (webTitle != null) {
        $("#SysTitle").html((webTitle == "" || webTitle == null) ? "默认系统名称" : webTitle.value);
    } else {
        $("#SysTitle").html("默认系统名称");
    }

    /*$(".user-icon ,.more-icon").click(function () {
        if ($("#opt_dropmenu").is(':hidden')) {
            $("#opt_dropmenu").fadeIn(100);
        }
    });*/

    startShowTime();
});

//绑定事件
function bindEvent() {
    $("#logoutbtn").bind("click", function () {
        logout();
    });
    $("#changpwd").bind("click", function () {
        $("#oldPassword").val("");
        $("#password1").val("");
        $("#password2").val("");
        $(".changepwd-modal-sm").modal("show");
    });
    $("#btn-changepwd-confirm").bind("click", function () {
        updatePassword();
    });
}

//注销
function logout() {
    var data = {};
    var cbSuccess = function () {
        window.location.href = "login.html";
    };
    var cbFailed = function () {
        window.location.href = "login.html";
    };
    CommonRemote.login.logout(data, cbSuccess, cbFailed);
}

//修改密码
function updatePassword() {
    var oldPassword = $("#oldPassword").val();
    oldPassword = $.trim(oldPassword);
    var password1 = $("#password1").val();
    password1 = $.trim(password1);
    var password2 = $("#password2").val();
    password2 = $.trim(password2);
    if (oldPassword.length <= 0) {
        CustumCommonUtil.showMsg("原密码不能为空", "", "", "50px");
        return;
    }
    if (password1.length <= 0) {
        CustumCommonUtil.showMsg("新密码不能为空", "", "", "50px");
        return;
    }
    if (password1 != password2) {
        CustumCommonUtil.showMsg("两次密码输入不一致", "", "", "50px");
        return;
    }
    var data = {
        password: password1,
        oldPassword: oldPassword
    };
    var cbSuccess = function () {
        CustumCommonUtil.showMsg("修改密码成功", "", "", "50px");
        $(".changepwd-modal-sm").modal("hide");
    };
    var cbFailed = function () {
        $(".changepwd-modal-sm").modal("hide");
    };
    CommonRemote.login.updatePassword(data, cbSuccess, cbFailed);

}

//开始显示时间
function startShowTime() {
    CustumTimeUtil.showTime("#timemsg");
    CommonRemote.getServerTime();
    window.setInterval("autoShowTime()", 1000); //时间秒表
    window.setInterval("CommonRemote.getServerTime()", 60 * 1000); //每隔60秒重新向服务器同步一次时间
};

//自动显示时间
function autoShowTime() {
    CustumTimeUtil.serverTime += 1000;
    CustumTimeUtil.showTime("#timemsg");
};

//关于
function about() {
    var url = CustumCommonUtil.basePath + "/license.jsp";
    var iWidth = 450;
    var iHeight = 280;
    var name = "授权信息";
    var iTop = (window.screen.height - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.width - 10 - iWidth) / 2; //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');

}