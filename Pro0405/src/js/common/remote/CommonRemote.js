var CommonRemote = new Object();
CommonRemote.basePath = CustumCommonUtil.basePath;
//-------------------------------------------公用---------------------------------------------------------

/*
* 根据名称获取系统参数值
* */
CommonRemote.getProperty = function (name, cbSuccess, cbFailed) {
    var propertyValue = {};
    $.ajax({
        type: "get",//请求方式
        url: CommonRemote.basePath + "/config/getProperty.do",
        data: ({
            'name': name,
        }),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: "json",
        async: false,
        success: function (res) {
            if (res.result == "ok") {
                propertyValue = res.data.p;
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
    return propertyValue;
};

/*
* 获取监区和监室
* */
CommonRemote.getGroupsAndRoom = function (cbSuccess, cbFailed) {
    var groupsandrooms = {};
    $.ajax({
        type: "get",//请求方式
        url: CommonRemote.basePath + "/config/findGroupAndRoom.do",
        data: ({
            'domainId': domainId,
            'pageInfo.pageNumber': 1,
            'pageInfo.pageSize': 500,
        }),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: "json",
        async: false,
        success: function (res) {
            if (res.result == "ok") {
                groupsandrooms = res.data.groups;
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
    return groupsandrooms;
};

/*
* 获取监区
* */
CommonRemote.getGroups = function (type) {
    var groups = {};
    $.ajax({
        type: "get",//请求方式
        url: CommonRemote.basePath + "/config/findRoomGroupList.do",
        data: ({
            'domainId': domainId,
            'pageInfo.pageNumber': 1,
            'pageInfo.pageSize': 500,
        }),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: "json",
        async: false,
        success: function (res) {
            if (res.result == "ok") {
                groups = res.data.rows;
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            }
        }
    });
    return groups;
};

/*
* 获取默认单位
* */
CommonRemote.getDomainList = function (cbSuccess, cbFailed) {
    var domainlist = {};
    $.ajax({
        type: "get",
        url: CommonRemote.basePath + "/config/findDomainList.do",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        async: false,
        success: function (res) {
            if (res.result == "ok") {
                domainlist = res.data.rows;
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("加载默认单位出错");
            }
        }
    });
    return domainlist;
};

/*
* 获取直播列表
* */
CommonRemote.getchanelList = function (cbSuccess, cbFailed) {
    var chanellist = {};
    $.ajax({
        type: "get",//请求方式
        url: CommonRemote.basePath + "/config/findChannelList.do",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        async: false,
        success: function (res) {
            if (res.result == "ok") {
                chanellist = res.data.rows;
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
    return chanellist;
};

/*
* 获取视频列表
* */
CommonRemote.getVodResource = function (cbSuccess, cbFailed) {
    var vodresource = {};
    $.ajax({
        type: "get",//请求方式
        url: CommonRemote.basePath + "/video/vodresource/search.do",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        async: false,
        success: function (res) {
            if (res.result == "ok") {
                if (res.data.list.length > 0) {
                    vodresource = res.data.list;
                }
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.goToLogin();
            }
        }
    });
    return vodresource;
};

/*
* 获取视频分组
* */
CommonRemote.getVodResourceGroup = function (cbSuccess, cbFailed) {
    var vodresourcegrouplist = {};
    $.ajax({
        type: "get",//请求方式
        url: CommonRemote.basePath + "/video/vodresourcegroup/search.do",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        async: false,
        success: function (res) {
            if (res.result == "ok") {
                if (res.data.list.length > 0) {
                    vodresourcegrouplist = res.data.list;
                }
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
    return vodresourcegrouplist;
};
/*
* 加载广播资源
* */
CommonRemote.loadBroadcastResource = function (cbSuccess, cbFailed) {
    var broadcastResource = {};
    $.ajax({
        url: CommonRemote.basePath + '/config/broadcastresource/findByPage.do',
        type: 'POST',
        dataType: 'html',
        async: false,
        timeout: 10000,
        data: ({}),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                broadcastResource = res.data.list;
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
    return broadcastResource;
};
//-------------------------------------------页面头---------------------------------------------------------
/*
* 获取服务器时间
* */
CommonRemote.getServerTime = function () {
    $.ajax({
        url: CommonRemote.basePath + '/getServerTime.do',
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({}),
        error: function (xhr, textStatus, thrownError) {
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                CustumTimeUtil.serverTime = res.data.time;
                CustumTimeUtil.showTime();
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            }
        }
    });
};

//-------------------------------------------登录---------------------------------------------------------
CommonRemote.login = new Object();
/*
* 登录
* */
CommonRemote.login.login = function (data, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/login.do',
        type: 'get',
        dataType: 'html',
        async: true,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        timeout: 10000,
        data: ({
            'username': data.username,
            'password': data.password,
            'passwordType': data.passwordType,
            'rember': data.rember
        }),
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
};

/*
* 注销
* */
CommonRemote.login.logout = function (data, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/logout.do',
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({}),
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
};

/*
* 修改密码
* */
CommonRemote.login.updatePassword = function (data, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/updatePassword.do',
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'oldPassword': data.oldPassword,
            'password': data.password
        }),
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result, "", "", "50px");
            }
        }
    });
};

/*
* 获取用户信息
* */
CommonRemote.login.userInfo = function (cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/userInfo.do',
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: 'html',
        async: true,
        timeout: 5000,
        data: ({}),
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            debugger;
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
};
//-------------------------------------------宣教控制---------------------------------------------------------
CommonRemote.xjkz = new Object();
CommonRemote.xjkz.video = new Object();
CommonRemote.xjkz.power = new Object();
CommonRemote.xjkz.brodcaset = new Object();
CommonRemote.xjkz.basePath = CustumCommonUtil.basectrlPath;
/**
 * 插播直播。  另外，插播点播的代码在status.js中。
 * opType : 类型。0指定房间（只支持0）
 * channelId : 频道ID（数据库ID）
 * roomIds ： int[] 房间ID数组
 * endtime ： String 格式 HH:mm:ss
 */
CommonRemote.xjkz.video.insertPlay = function (opType, domainId, channelId, roomIds, endtime, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "insertPlay.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0, //0表示指定房间
            'programType': 1, //1表示直播
            'domainId': domainId,
            'roomIds': roomIds.toString(), //后台需要的数据格式：多个房间ID，以英文逗号隔开
            'channelId': channelId,
            'endtime': endtime
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 插播点播
 * opType : 类型。0指定房间（只支持0）
 * roomIds ： int[] 房间ID数组
 */
CommonRemote.xjkz.video.insertPlayVod = function (data, cbSuccess, cbFailed) {
    if (data == null) {
        return;
    }
    $.ajax({
        url: CommonRemote.xjkz.basePath + "insertPlay.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0, //0表示指定房间
            'programType': 2, //2表示点播
            'roomIds': data.roomIds.toString(),
            'vodPlayModel': data.vodPlayModel,
            'vodResourceGroupId': data.vodResourceGroupId,
            'vodResourceId': data.vodResourceId,
            'endtime': data.endtime
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError, "200px", "50");
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
}

/**
 * 取消插播
 * opType : 类型。0指定房间（只支持0）
 * roomIds ： int[] 房间ID数组
 */
CommonRemote.xjkz.video.cancelInsertPlay = function (opType, domainId, roomIds, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "cancelInsertPlay.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0,
            'domainId': domainId,
            'roomIds': roomIds.toString()
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};
/**
 * 视频控制
 * opType : 类型。0指定房间（只支持0）
 * roomIds ： int[] 房间ID数组
 */
CommonRemote.xjkz.video.videoCtrl = function (opType, domainId, roomIds, videoCtrlType, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "videoCtrl.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0,
            'domainId': domainId,
            'roomIds': roomIds.toString(),//后台需要的数据格式：多个房间ID，以英文逗号隔开
            'videoCtrlType': videoCtrlType
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 音量控制
 * opType : 类型。0指定房间（只支持0）
 * roomIds ： int[] 房间ID数组
 * videoVolume : 机顶盒音量，音量 0-100, null表示没有设置机顶盒的音量
 * broadcastVolume : 广播音量，音量 0-100, null表示没有设置广播的音量
 */
CommonRemote.xjkz.video.volumeCtrl = function (opType, domainId, roomIds, videoVolume, broadcastVolume, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "volumeCtrl.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0,
            'domainId': domainId,
            'roomIds': roomIds.toString(),//后台需要的数据格式：多个房间ID，以英文逗号隔开
            'videoVolume': videoVolume,
            'broadcastVolume': broadcastVolume
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 显示公告
 * opType : 类型。0指定房间（只支持0）
 * roomIds ： int[] 房间ID数组
 */
CommonRemote.xjkz.video.showNotice = function (opType, domainId, roomIds, noticeContent, noticeTime, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "showNotice.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0,
            'domainId': domainId,
            'roomIds': roomIds.toString(),//后台需要的数据格式：多个房间ID，以英文逗号隔开
            'noticeContent': noticeContent,
            'noticeTime': noticeTime //单位：秒
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 预案控制。
 * domainId ： 单位ID(可能无实际用处)
 * roomIds ： int[] 房间ID数组
 * enable ： boolean true启用，false停止
 */
CommonRemote.xjkz.video.planCtrl = function (domainId, roomIds, enable, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "planCtrl.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'domainId': domainId,
            'roomIds': roomIds.toString(),//后台需要的数据格式：多个房间ID，以英文逗号隔开
            'planCtrlType': enable ? 1 : 2
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 恢复自动控制
 * opType : 类型。0指定房间（只支持0）
 * roomIds ： int[] 房间ID数组
 */
CommonRemote.xjkz.video.reset = function (opType, domainId, roomIds, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "reset.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0,
            'domainId': domainId,
            'roomIds': roomIds.toString()//后台需要的数据格式：多个房间ID，以英文逗号隔开
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

//-------------------------------------------电源控制---------------------------------------------------------
/**
 * 接通电源
 * opType : 类型。0指定房间（只支持0）
 * roomIds ： int[] 房间ID数组
 */
CommonRemote.xjkz.power.poweron = function (opType, domainId, roomIds, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "poweron.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0,
            'domainId': domainId,
            'roomIds': roomIds.toString()//后台需要的数据格式：多个房间ID，以英文逗号隔开
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};


/**
 * 断开电源
 * opType : 类型。0指定房间（只支持0）
 * roomIds ： int[] 房间ID数组
 */
CommonRemote.xjkz.power.poweroff = function (opType, domainId, roomIds, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "poweroff.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'opType': 0,
            'domainId': domainId,
            'roomIds': roomIds.toString()//后台需要的数据格式：多个房间ID，以英文逗号隔开
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 显示电源控制器状态
* */
CommonRemote.loadPowerDeviceStatus = function () {
    $.ajax({
        url: CommonRemote.xjkz.basePath + "powerDeviceStatus.do",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({}),
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (res.data.isException == true) {
                    CustumCommonUtil.showMsg("<span style='font-size: 23px; color: white;'>部分电源控制器连接失败</span><a style='margin-left: 10px;color: lightgreen; text-decoration:none;' href=\"" + CustumCommonUtil.basePath + "/program/powerdevicestatus.html\" target='_blank'>查看详情</a><a href='javascript:layer.closeAll()' style='margin-left: 10px;color: red; text-decoration:none;''>关闭</a>", "450px", "60px", "", "60000")
                } else {
                    CustumCommonUtil.showMsg("<a style='margin-left: 10px;color: lightgreen; text-decoration:none;' title='点击查看详情' href=\"" + CustumCommonUtil.basePath + "/program/powerdevicestatus.html\" target='_blank'>电源控制器连接全部正常</a>", "300px", "50px")
                }
                window.setTimeout("CommonRemote.loadPowerDeviceStatus()", 60000);
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            }
        }
    });

};

//-------------------------------------------宣教预案---------------------------------------------------------
CommonRemote.xjya = new Object();
//-------------------------------------------宣教计划---------------------------------------------------------
/*
* 加载节目列表，pageNumber指定的页码
* */
CommonRemote.xjya.loadProgramPlan = function (cbSuccess, cbFailed) {
    if ((groupId == null || groupId <= 0) && (roomId == null || roomId <= 0)) {
        CustumCommonUtil.showMsg("请点击左侧列表")
        return;
    }
    $.ajax({
        url: CommonRemote.basePath + '/program/findProgramPlanList.do',
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'groupId': groupId,
            'roomId': roomId,
            'day': dayString
        }),
        xhrFields: {
            withCredentials: true
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });

};

/*
* 增加、修改节目
* */
CommonRemote.xjya.submit_create = function (opType, progData, day, cbSuccess, cbFailed) {
    var url = opType == 1 ? "createProgramPlan.do" : "updateProgramPlan.do";
    url = CustumCommonUtil.basePath + "/program/" + url;
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'groupId': progData.groupId * 1,
            'roomId': progData.roomId * 1,
            'day': day,
            'programIndex': progData.index * 1,
            'program.type': progData.type * 1,
            'program.starttime': progData.starttime,
            'program.endtime': progData.endtime,
            'program.vodPlayModel': progData.vodPlayModel,
            'program.vodResourceGroupId': progData.vodResourceGroupId,
            'program.channelId': progData.channelId * 1,
            'program.vodResourceId': progData.vodResourceId,
            'program.vodResourceName': progData.vodResourceName,
            'program.broadcastresource': progData.broadcastresource,
            'program.desc': progData.desc,
            'program.volume': progData.volume * 1
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 删除节目
* */
CommonRemote.xjya.deleteProgram = function (groupId, roomId, day, programIndex, cbSuccess, cbFailed) {
    $.ajax({
        url: CustumCommonUtil.basePath + "/program/deleteProgramPlan.do",
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'groupId': groupId * 1,
            'roomId': roomId * 1,
            'day': day,
            'programIndex': programIndex * 1
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 提交数据：复制节目
 */
CommonRemote.xjya.submitCopyProgram = function (groupId, roomId, day, programIndex, sourceWeekday, targetWeekdays, cbSuccess, cbFailed) {
    $.ajax({
        url: CustumCommonUtil.basePath + "/program/applyProgramPlan.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'groupId': groupId,
            'roomId': roomId,
            'day': day,
            'targetWeekDays': targetWeekdays //后台需要的数据格式：多个数字，以英文逗号隔开
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/***********                    宣教模板                                                         **********/

/*
* 获取模板列表
* */
CommonRemote.xjya.loadTemplateList = function (cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + "/program/findTemplateList.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'pageInfo.pageNumber': 1,
            'pageInfo.pageSize': 500
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
            }
        }
    });
};

/*
* 加载模板列表，pageNumber指定的页码
* */
CommonRemote.xjya.loadTemplate = function (templateId, cbSuccess, cbFailed) {
    if (templateId == null || templateId <= 0) {
        return;
    }
    $.ajax({
        url: CommonRemote.basePath + "/program/findTemplate.do",
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'templateId': templateId
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 增加、修改模板中的节目
* */
CommonRemote.xjya.submit_create_template = function (opType, progData, cbSuccess, cbFailed) {
    var weekday = $("#weekday").val();
    var url = opType == 1 ? "createTemplateProgram.do" : "updateTemplateProgram.do";
    url = CommonRemote.basePath + "/program/" + url;
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'templateId': progData.templateId * 1,
            'weekday': weekday * 1,
            'programIndex': progData.index * 1,
            'program.type': progData.type,
            'program.starttime': progData.starttime,
            'program.endtime': progData.endtime,
            'program.channelId': progData.channelId,
            'program.vodPlayModel': progData.vodPlayModel,
            'program.vodResourceGroupId': progData.vodResourceGroupId,
            'program.vodResourceId': progData.vodResourceId,
            'program.vodResourceName': progData.vodResourceName,
            'program.broadcastresource': progData.broadcastresource,
            'program.desc': progData.desc,
            'program.volume': progData.volume
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 删除模板中的节目
* */
CommonRemote.xjya.deleteTemplateProgram = function (templateId, weekday, programIndex, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + "/program/deleteTemplateProgram.do",
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        async: false,
        data: ({
            'weekday': weekday * 1,
            'templateId': templateId * 1,
            'programIndex': programIndex * 1
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 提交数据：复制模板节目
 */
CommonRemote.xjya.submitCopyTmplateProgram = function submitCopyProgram(templateId, sourceWeekday, targetWeekdays, cbSuccess, cbFailed) {

    $.ajax({
        url: CommonRemote.basePath + "/program/copyTemplateProgram.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 15000,
        data: ({
            'templateId': templateId,
            'weekday': sourceWeekday,
            'targetWeekDays': targetWeekdays //后台需要的数据格式：多个数字，以英文逗号隔开
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 增加模板
* */
CommonRemote.xjya.submitTemplate = function (opType, id, type, name, cbSuccess, cbFailed) {
    var url = opType == 1 ? "createTemplate.do" : "updateTemplate.do"
    url = CommonRemote.basePath + "/program/" + url;
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'templateId': id * 1,
            'templateType': type * 1,
            'templateName': name
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 删除模板
* */
CommonRemote.xjya.deleteTemplate = function (id, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + "/program/deleteTemplate.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'templateId': id * 1
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 复制模板
* */
CommonRemote.xjya.submitCopy = function (id, name, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + "/program/copyTemplate.do",
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'templateId': id * 1,
            'templateName': name
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 应用模板（整个单位）
* */
CommonRemote.xjya.applyTemplate2Domain = function (templateId, domainId, override, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/program/applyTemplate2Domain.do',
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'templateId': templateId,
            'domainId': domainId,
            'override': override
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 应用模板（指定监区）
* */
CommonRemote.xjya.applyTemplate2RoomGroup = function (domainId, roomGroupIds, templateId, override, cbSuccess, cbFailed) {

    $.ajax({
        url: CommonRemote.basePath + '/program/applyTemplate2RoomGroup.do',
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'domainId': domainId,
            'roomGroupIds': roomGroupIds,
            'templateId': templateId,
            'override': override
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 应用模板（指定监室）
* */
CommonRemote.xjya.applyTemplate2Room = function (domainId, roomIds, templateId, override, cbSuccess, cbFailed) {

    $.ajax({
        url: CommonRemote.basePath + '/program/applyTemplate2Room.do',
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'domainId': domainId,
            'roomIds': roomIds,
            'templateId': templateId,
            'override': override
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 获取应用指定模板的监区
* */
CommonRemote.xjya.loadRoomGroupsByTemplateId = function (templateId, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/program/findRoomGroupsByTemplateId.do',
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'templateId': templateId
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 获取应用指定模板的监室
* */
CommonRemote.xjya.loadRoomsByTemplateId = function (templateId, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/program/findRoomsByTemplateId.do',
        type: 'POST',
        dataType: 'html',
        async: true,
        timeout: 10000,
        data: ({
            'templateId': templateId
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

//-------------------------------------------系统配置---------------------------------------------------------
CommonRemote.xtpz = new Object();
//--------------------单位配置--------------------------------------------------------------------------------
/*
* 添加 编辑 单位
* */
CommonRemote.xtpz.modifyDomain = function (opType, id, name, cbSuccess, cbFailed) {
    var url = CommonRemote.basePath + "/config/";
    url = opType == 1 ? url + "addDomain.do" : url + "updateDomain.do"
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'html',
        timeout: 6000,
        data: ({
            'domain.id': id,
            'domain.name': name
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("操作失败: " + res.result);
            }
        }
    });
};

/*
* 删除单位
* */
CommonRemote.xtpz.doDeleteDomain = function (domain, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/config/deleteDomain.do',
        type: 'POST',
        dataType: 'html',
        timeout: 5000,
        data: ({
            'domainId': domain.id
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("操作失败: " + res.result);
            }
        }
    });
};

//--------------------用户管理--------------------------------------------------------------------------------
/*
* 新增 编辑 用户
* */
CommonRemote.xtpz.modifyUser = function (user, opType, cbSuccess, cbFailed) {
    var url = CommonRemote.basePath + "/config/";
    url = opType == 1 ? url + "addUser.do" : url + "updateUser.do"
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        timeout: 6000,
        data: ({
            'id': user.id,
            'domainId': user.domainId,
            'roomGroupIds': user.roomGroupIds.toString(),
            'fullname': user.fullname,
            'username': user.username,
            'password1': user.password1,
            'password2': user.password2
        }),
        beforeSubmit: function () {
        },
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError, "300px");
        },
        success: function (response) {
            var res = response;
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 删除用户
* */
CommonRemote.xtpz.doDeleteUser = function (user, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/config/deleteUser.do',
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'id': user.id
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};
//--------------------监室配置--------------------------------------------------------------------------------
/*
* 监区：增、删、改
* */
CommonRemote.xtpz.modifyRoomGroup = function (mod, id, name, number, notes, color, domainId, cbSuccess, cbFailed) {//mod为方法参数，1为增加，2为修改，3为删除。
    $.ajax({
        url: CommonRemote.basePath + '/config/ctlRoomGroup.do',
        type: 'POST',
        dataType: 'html',
        timeout: 60000,
        data: ({
            'domainId': domainId,
            'rg.id': id,
            'rg.name': name,
            'rg.number': number,
            'rg.notes': notes,
            'rg.color': color,
            'mod': mod
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("操作失败: " + res.result);
            }
        }
    });
};

//监室：增、改
CommonRemote.xtpz.modifyRoom = function (param, cbSuccess, cbFailed) {//mod为方法参数，1为增加，2为修改
    $.ajax({
        url: CommonRemote.basePath + '/config/ctlRoom.do',
        type: 'POST',
        dataType: 'html',
        timeout: 60000,
        data: ({
            'mod': param.mod,
            'room.id': param.id,
            'room.number': param.number,
            'room.roomGroup.id': param.roomGroupId,
            'room.name': param.name,
            'room.powerIP': param.powerIP,
            'room.powerPort': param.powerPort,
            'room.powerNumber': param.powerNumber,
            'room.bctID': param.bctID,
            'room.mssIP': param.mssIP,
            'room.status': param.status
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("操作失败: " + res.result);
            }
        }
    });
};


//删除监室
CommonRemote.xtpz.deleteRoom = function (id, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/config/ctlRoom.do',
        type: 'POST',
        dataType: 'html',
        timeout: 60000,
        data: ({
            'mod': 3,
            'room.id': id
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("操作失败: " + res.result);
            }
        }
    });
};
//--------------------电视频道--------------------------------------------------------------------------------
//服务器选择列表
CommonRemote.xtpz.lodeVodserver = function (cbSuccess, cbFailed) {
    var vodserverList = {};
    $.ajax({
        url: CommonRemote.basePath + '/video/findvodserverlist.do',
        type: 'POST',
        dataType: 'html',
        timeout: 60000,
        data: ({
            "vod": null,
            "pageInfo": null
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                vodserverList = res.data.rows
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("操作失败: " + res.result);
            }
        }
    });
    return vodserverList;
};

//视频通道列表进行的操作
CommonRemote.xtpz.modifyChannel = function (mod, id, name, number, type, url, vodServer_id, cbSuccess, cbFailed) {//mod为方法参数，1为增加，2为修改，3为删除。
    $.ajax({
        url: CommonRemote.basePath + '/config/ctlChannel.do',
        type: 'POST',
        dataType: 'html',
        timeout: 60000,
        data: ({
            'chl.id': id,
            'chl.number': number,
            'chl.name': name,
            'chl.type': type,
            'chl.url': url,
            'chl.vodserver.id': vodServer_id,
            'mod': mod
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("操作失败: " + res.result);
            }
        }
    })
};

//--------------------点播视频--------------------------------------------------------------------------------


/**
 * 增加分组
 */
CommonRemote.xtpz.requestAddVodResourceGroup = function (name, sortValue, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/video/vodresourcegroup/add.do',
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            "name": name,
            "sortValue": sortValue
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            var error = xhr.readyState != 0 && xhr.readyState != 1 ? xhr.status : textStatus;
            error = "请求失败[" + error + "]";
            CustumCommonUtil.showMsg(error);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 修改分组
 */
CommonRemote.xtpz.requestUpdateVodResourceGroup = function (id, name, sortValue, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/video/vodresourcegroup/update.do',
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            "id": id,
            "name": name,
            "sortValue": sortValue
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            var error = xhr.readyState != 0 && xhr.readyState != 1 ? xhr.status : textStatus;
            error = "请求失败[" + error + "]";
            CustumCommonUtil.showMsg(error);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};


/**
 * 删除分组
 */
CommonRemote.xtpz.requestDeleteVodResourceGroup = function (id, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/video/vodresourcegroup/delete.do',
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            "id": id
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            var error = xhr.readyState != 0 && xhr.readyState != 1 ? xhr.status : textStatus;
            error = "请求失败[" + error + "]";
            CustumCommonUtil.showMsg(error);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/**
 * 获取视频上传的参数
 * @param name 文件名称
 */
CommonRemote.xtpz.prepareUploadInfo = function (name, cbSuccess, cbFailed) {
    var load = CustumCommonUtil.createLoad();
    $.ajax({
        url: CommonRemote.basePath + '/video/vodresource/prepareUploadInfo.do',
        type: 'POST',
        dataType: 'html',
        timeout: 15000,
        data: ({
            "name": name
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            var error = xhr.readyState != 0 && xhr.readyState != 1 ? xhr.status : textStatus;
            error = "请求失败[" + error + "]";
            CustumCommonUtil.showMsg(error);
            CustumCommonUtil.closeLoad(load);
        },
        success: function (response) {
            CustumCommonUtil.closeLoad(load);
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

//=======================================FTP上传========================================================
CommonRemote.xtpz.ftpUpload = new Object();
CommonRemote.xtpz.ftpUpload.uploadList = null;
CommonRemote.xtpz.ftpUpload.uploadIndex = -1;
CommonRemote.xtpz.ftpUpload.uploadLocalPath = "";
//开始上传
CommonRemote.xtpz.ftpUpload.startUpload = function (_uploadList) {
    window.uploadList = _uploadList;
    window.uploadIndex = 0;
    this.uploadNext();
};

//上传文件到下一个服务器
CommonRemote.xtpz.ftpUpload.uploadNext = function (FtpServerInfo) {
    if (uploadList == null || uploadList.length <= 0) {
        return;
    }
    var uploadInfo = null;
    if (uploadList.length > uploadIndex) {
        uploadInfo = uploadList[uploadIndex];
    }
    if (uploadInfo == null) {
        return;
    }

    var FtpServerInfo = uploadInfo.ftpInfo;
    var localpath = $("#file").val();
    var file = new Object();
    file.localpath = localpath;
    file.dstpath = FtpServerInfo.uploadpath;
    file.filname = FtpServerInfo.uploadname;

    var uploadParam = new Object();
    uploadParam.s = FtpServerInfo.ftpIp;
    uploadParam.u = FtpServerInfo.ftpUser;
    uploadParam.p = FtpServerInfo.password;

    //file.localpath = file.localpath.replace(/\\/g, "\\\\");
    var json = " {"
        + "\"srcpath\" : \"" + CustumCommonUtil.ZhToUnicode(file.localpath) + "\","
        + "\"dstpath\" : \"" + CustumCommonUtil.ZhToUnicode(file.dstpath) + "\","
        + "\"dstfile\" : \"" + CustumCommonUtil.ZhToUnicode(file.filname) + "\","
        + "\"ftpip\" : \"" + uploadParam.s + "\","
        + "\"ftpport\" : " + 2121 + ","
        + "\"ftpusr\" : \"" + uploadParam.u + "\","
        + "\"ftppass\" : \"" + uploadParam.p + "\","
        + "\"usedata\" : 1"
        + "}";

    var uploadParamObj = {
        srcpath: file.localpath,
        dstpath: file.dstpath,
        dstfile: file.filname,
        ftpip: uploadParam.s,
        ftpport: 21,
        ftpusr: uploadParam.u,
        ftppass: uploadParam.p,
        usedata: 1
    };
    //var json = JSON.stringify(uploadParamObj); //通过JSON.stringify转换的中文ftphelp不认识，在IE8下json2.js被IE内置的JSON.stringify函数覆盖
    //alert(json);
    ftphelp.postCommand(3, json);

    var isDemoOfMss = false;
    if (isDemoOfMss) {
        //用于没有流媒体的服务时，测试专用
        window.setTimeout(function () {
            var result = new Object();
            result.error = 0;
            result.proc = 50;
            result.finish = false;
            CommonRemote.xtpz.ftpUpload.recvUploadEvent(result);
        }, 3000);

        window.setTimeout(function () {
            var result = new Object();
            result.error = 0;
            result.proc = 100;
            result.finish = true;
            CommonRemote.xtpz.ftpUpload.recvUploadEvent(result);
        }, 5000);
    }
};
/**
 * 接收上传事件
 */
CommonRemote.xtpz.ftpUpload.recvUploadEvent = function (result) {
// {
// "finish" : false,//是否已经结束
// "proc" :10, //上传的进度
// "error" : 1, //错误码 参考emError
// "usedata" :5//用户标示
// }
    if (result.error != 0) {
        CustumCommonUtil.showMsg('文件上传失败:' + FtpEror[result.error].desc);
    } else {
        var proc = result.proc;
        if (result.finish == true) {
            proc = 100;
            this.complateUpload();
        } else {
        }
        //proc = computerProgress(proc);
        //showProgress(proc);
    }
};

/**
 * 完成上传
 */
CommonRemote.xtpz.ftpUpload.complateUpload = function () {

    var uploadInfo = uploadList[uploadIndex];
    var number = uploadInfo.number;
    var mssId = uploadInfo.mssInfo.id
    var uploadId = uploadInfo.uploadId;
    var groupId = $("#dlg_group").val();
    var name = $("#dlg_resourceName").val();
    var load = CustumCommonUtil.createLoad();
    $.ajax({
        url: CommonRemote.basePath + '/video/vodresource/complateUpload.do',
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            "number": number,
            "mssId": mssId,
            "uploadId": uploadId,
            "groupId": groupId,
            "name": name
        }),
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.closeLoad(load);
            var error = xhr.readyState != 0 && xhr.readyState != 1 ? xhr.status : textStatus;
            error = "请求失败[" + error + "]";
            CustumCommonUtil.showMsg(error);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result != "ok") {
                CustumCommonUtil.showMsg(res.result);
                CustumCommonUtil.closeLoad(load);
                return;
            }

            var vodResource = res.data.vodResource;
            if (uploadList == null || uploadList.length <= 0 || uploadIndex == uploadList.length - 1) {
                //上传完成
                $("#table_dbsp").bootstrapTable("refresh");
                $(".upfile-modal-sm").modal("hide");
            } else {
                //继续上传下一个
                uploadIndex++;
                CommonRemote.xtpz.ftpUpload.uploadNext();
            }
        }
    });

};


/**
 * 更新视频资源（只更新描述）
 */
CommonRemote.xtpz.requestUpdateVodResource = function (id, groupId, name, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/video/vodresource/update.do',
        type: 'POST',
        dataType: 'html',
        timeout: 15000,
        data: ({
            "id": id,
            "groupId": groupId,
            "name": name
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            var error = xhr.readyState != 0 && xhr.readyState != 1 ? xhr.status : textStatus;
            error = "请求失败[" + error + "]";
            CustumCommonUtil.showMsg(error);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

//--------------------广播节目--------------------------------------------------------------------------------
/*
* 向服务器增加广播节目
* */
CommonRemote.xtpz.request_Add_broadcastresource = function (filename, cbSuccess, cbFailed) {
    var load = CustumCommonUtil.createLoad();
    $("#dlg_form").ajaxSubmit({
        url: CommonRemote.basePath + "/config/broadcastresource/uploadResource.do",
        //iframe: true,
        type: "POST",
        dataType: "html",
        data: ({
            'filename': filename
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        beforeSubmit: function () {
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.closeLoad(load);
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            CustumCommonUtil.closeLoad(load);
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 向服务器更新广播节目
* */
CommonRemote.xtpz.request_Update_broadcastresource_name = function (id, name, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + "/config/broadcastresource/updateName.do",
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'id': id,
            'name': name
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

/*
* 向服务器删除指定行
* */
CommonRemote.xtpz.request_delete_broadcastresource_byid = function (id, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + "/config/broadcastresource/deleteById.do",
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'id': id
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};

//--------------------流媒体服务器--------------------------------------------------------------------------------
/*
* 提交流媒体服务器数据
* */
CommonRemote.xtpz.submitlmtfwqData = function (opType, mssId, mssName, mssIP, mssUsername, mssPassword, mssVersion, cbSuccess, cbFailed) {
    var url = CommonRemote.basePath;
    url += opType == 1 ? "/video/mssinfo/update.do" : "/video/mssinfo/create.do";
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'html',
        timeout: 5000,
        data: ({
            'mssInfo.id': mssId,
            'mssInfo.name': mssName,
            'mssInfo.ip': mssIP,
            'mssInfo.username': mssUsername,
            'mssInfo.password': mssPassword,
            'mssInfo.version': mssVersion
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("操作失败: " + res.result);
            }
        }
    });
};

/*
* 删除流媒体服务器数据
* */
CommonRemote.xtpz.deletelmtfwqDataById = function (id, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + "/video/mssinfo/delete.do",
        type: 'POST',
        dataType: 'html',
        timeout: 5000,
        data: ({
            'mssInfoID': id
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.readyState != 0 && xhr.readyState != 1) {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            } else {
                CustumCommonUtil.showMsg("操作失败，错误号:  " + xhr.status + ";" + textStatus + ";" + thrownError);
            }
        },
        success: function (response) {
            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg("删除失败: " + res.result);
            }
        }
    });
};
//--------------------参数配置--------------------------------------------------------------------------------
//向服务器更新参数
CommonRemote.xtpz.updatePropertyRow = function (name, value, desc, cbSuccess, cbFailed) {
    $.ajax({
        url: CommonRemote.basePath + '/config/updateProperty.do',
        type: 'POST',
        dataType: 'html',
        timeout: 10000,
        data: ({
            'name': name,
            'value': value,
            'desc': desc
        }),
        xhrFields: {
            withCredentials: true // 这里设置了withCredentials 解决跨域问题
        },
        error: function (xhr, textStatus, thrownError) {
            CustumCommonUtil.showAjaxError(xhr, textStatus, thrownError);
        },
        success: function (response) {

            var res = eval('(' + response + ')');
            if (res.result == "ok") {
                if (cbSuccess != null) {
                    cbSuccess(res);
                }
            } else if (res.result == "没有登录") {
                CustumCommonUtil.goToLogin();
            } else {
                if (cbFailed != null) {
                    cbFailed(res);
                }
                CustumCommonUtil.showMsg(res.result);
            }
        }
    });
};