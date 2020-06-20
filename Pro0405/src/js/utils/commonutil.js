//首页头部  登录下拉隐藏
$(document).bind('click', function (e) {
    var e = e || window.event; //浏览器兼容性
    var elem = e.target || e.srcElement;
    while (elem) { //循环判断至跟节点，防止点击的是div子元素
        if (elem.className && elem.className == 'loginmsg') {
            $("#opt_dropmenu").fadeIn(100);
            return;
        }
        if (elem.className && elem.className == 'dropmenu') {
            $("#opt_dropmenu", window.top.document).fadeOut(100);
            return;
        }
        elem = elem.parentNode;
    }
    $("#opt_dropmenu", window.top.document).fadeOut(100); //点击的不是div或其子元素
});

var CustumCommonUtil = {
    //基路径
    basePath: "http://47.100.77.209/es-s100-web",
    //ctrl.js中的基路径
    basectrlPath: "http://47.100.77.209/es-s100-web/ctrl/",
    //监室状态定义
    manualControlRoomStatus: [
        {//0
            "CSSname": "jystatusplay",
            "Alias": "播放"
        }, {//1
            "CSSname": "jystatuspause",
            "Alias": "暂停"
        }, {//2
            "CSSname": "jystatusmute",
            "Alias": "静音"
        }, {//3
            "CSSname": "jystatusstop",
            "Alias": "停止"
        }, {//4
            "CSSname": "jystatusdefault",
            "Alias": "  "
        }, {//5
            "CSSname": "jystatusshutdown",
            "Alias": "关机"
        }, {//6
            "CSSname": "jystatusdisable",
            "Alias": "禁用预案"
        }, {//7
            "CSSname": "jystatusinsert",
            "Alias": "插播"
        }, {//8
            "CSSname": "jystatusdibbling",
            "Alias": "插播直播"
        }, {//9
            "CSSname": "jystatuslive",
            "Alias": "插播点播"
        }
    ],
    createLoad: function () {
        var load = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        return load;
    },
    closeLoad: function (loadObj) {
        layer.close(loadObj);
    },
    //显示提示
    showMsg: function (msg, width, height, offset, time) {
        /*var width = (width != undefined && width != null && width != "") ? width : '250px';
        var height = (height != undefined && height != null && height != "") ? height : '50px';
        var offset = (offset != undefined && offset != null && offset != "") ? offset : 't';
        var time = (time != undefined && time != null && time != "") ? time : '2000';*/
        if (msg.length <= 10) {
            width = (width != undefined && width != null && width != "") ? width : msg.length * 40 + "px";
            height = (height != undefined && height != null && height != "") ? height : '50px';
        } else if (msg.length > 10 && msg.length <= 20) {
            width = (width != undefined && width != null && width != "") ? width : msg.length * 30 + "px";
            height = (height != undefined && height != null && height != "") ? height : '50px';
        } else if (msg.length > 20 && msg.length <= 100) {
            width = (width != undefined && width != null && width != "") ? width : "500px";
            height = (height != undefined && height != null && height != "") ? height : '200px';
        } else if (msg.length > 100) {
            width = (width != undefined && width != null && width != "") ? width : "500px";
            height = (height != undefined && height != null && height != "") ? height : '500px';
        } else {
            width = (width != undefined && width != null && width != "") ? width : "250px";
            height = (height != undefined && height != null && height != "") ? height : '80px';
        }
        var offset = (offset != undefined && offset != null && offset != "") ? offset : 't';
        // var offset = (offset != undefined && offset != null && offset != "") ? offset : '5%';
        var time = (time != undefined && time != null && time != "") ? time : '2000';
        msg = (msg != null && msg.length > 0) ? msg : "未读取到数据";
        msg = "<span style='font-size: 20px'>" + msg + "</span>";
        layer.msg(msg, {area: [width, height], offset: offset, time: time});
    },
    //Ajax请求失败时的处理函数
    showAjaxError: function (xhr, textStatus, thrownError, width, height, offset, time) {
        var error;
        if (xhr.readyState != 0 && xhr.readyState != 1) {
            error = xhr.status;
        } else {
            error = textStatus;
        }
        error = "请求失败[" + error + "]";
        window.status = error;
        this.showMsg(error, width, height, offset, time)
    },
    goToLogin: function () {
        window.location.href = "login.html";
    },
    strEndWith: function (str, endStr) {
        var d = str.length - endStr.length;
        return (d >= 0 && str.lastIndexOf(endStr) == d);
    },
    //将字符串转为unicode编码
    ZhToUnicode: function (str) {
        var ret = '';
        for (var i = 0; i < str.length; i++) {
            var c = str[i];
            var cc = parseInt(c.charCodeAt(0), 10);
            if (c == "\\") {
                ret += "\\\\";
            } else if (cc <= 255) {
                ret += str[i];
            } else {
                ret += "\\u" + cc.toString(16);
            }

        }
        return ret;
    },
    getObjectURL: function (file) {
        var url = null;
        if (window.createObjcectURL != undefined) {
            url = window.createOjcectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    },
    //FX获取文件路径方法
    readFileFirefox: function (fileBrowser) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
            this.showMsg('无法访问本地文件，由于浏览器安全设置。为了克服这一点，请按照下列步骤操作：(1)在地址栏输入"about:config";(2) 右键点击并选择 New->Boolean; (3) 输入"signed.applets.codebase_principal_support" （不含引号）作为一个新的首选项的名称;(4) 点击OK并试着重新加载文件');
            return;
        }
        var fileName = fileBrowser.value; //这一步就能得到客户端完整路径。下面的是否判断的太复杂，还有下面得到ie的也很复杂。
        var file = Components.classes["@mozilla.org/file/local;1"]
            .createInstance(Components.interfaces.nsILocalFile);
        try {
            // Back slashes for windows
            file.initWithPath(fileName.replace(/\//g, "\\\\"));
        } catch (e) {
            if (e.result != Components.results.NS_ERROR_FILE_UNRECOGNIZED_PATH) throw e;
            this.showMsg("File '" + fileName + "' cannot be loaded: relative paths are not allowed. Please provide an absolute path to this file.");
            return;
        }
        if (file.exists() == false) {
            this.showMsg("File '" + fileName + "' not found.");
            return;
        }
        return file.path;
    },
    //根据不同浏览器获取路径
    getvl: function (obj) {
        //判断浏览器
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        var file_url = "";
        if (Sys.ie <= "6.0") {
            //ie5.5,ie6.0
            file_url = obj.value;
        } else if (Sys.ie >= "7.0") {
            //ie7,ie8
            obj.select();
            obj.blur();
            file_url = document.selection.createRange().text;
        } else if (Sys.firefox) {
            //fx
            //file_url = document.getElementById("file").files[0].getAsDataURL();//获取的路径为FF识别的加密字符串
            file_url = this.readFileFirefox(obj);
        } else if (Sys.chrome) {
            file_url = obj.value;
        }
        //alert(file_url);
        //document.getElementById("text").innerHTML = "获取文件域完整路径为：" + file_url;
        return file_url;
    },
    //获取当前页面的缩放值
    detectZoom: function () {
        var ratio = 0,
            screen = window.screen,
            ua = navigator.userAgent.toLowerCase();

        if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        } else if (~ua.indexOf('msie')) {
            if (screen.deviceXDPI && screen.logicalXDPI) {
                ratio = screen.deviceXDPI / screen.logicalXDPI;
            }
        } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
            ratio = window.outerWidth / window.innerWidth;
        }

        if (ratio) {
            ratio = Math.round(ratio * 100);
        }
        return ratio;
    },
    getScreenParam: function () {
        var param = {};
        param.width = document.documentElement.clientWidth;
        param.height = document.documentElement.clientHeight;
        return param;
    },

    //测试方法执行次数函数
    testFuc: function someFunction(fucname) {
        console.count(fucname + ' 已经执行');
    },
    //测试方法执行次数函数
    showSuccess: function someFunction() {
        layer.msg("成功!!!!!!");
    }
};