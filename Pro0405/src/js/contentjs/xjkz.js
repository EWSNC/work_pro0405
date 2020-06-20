//单位ID
var domainId = "";
$(function () {
    initpage();
    CommonRemote.loadPowerDeviceStatus();
});

/*
* 初始化页面
* */
function initpage() {
    var domainCbSuccess = function (res) {
        if (res.data.rows.length > 0) {
            //设置选中的默认单位
            if ("" == domainId) {
                domainId = res.data.rows[0].id;
            }
        }
    };
    var channelListSuccess = function (res) {
        if (res.data.rows.length > 0) {
            //设置选中的默认单位
            if ("" == domainId) {
                domainId = res.data.rows[0].id;
            }
        }
    };
    var domainlist = CommonRemote.getDomainList(domainCbSuccess);
    var groupsAndroom = CommonRemote.getGroupsAndRoom();
    var chanellist = CommonRemote.getchanelList(channelListSuccess);
    initbtn("", groupsAndroom, domainlist, chanellist);
    bindEvent(groupsAndroom, domainlist, chanellist);
}

/*
* 重新加载页面
* */
function reloadpage() {
    var domainCbSuccess = function (res) {
        if (res.data.rows.length > 0) {
            //设置选中的默认单位
            if ("" == domainId) {
                domainId = res.data.rows[0].id;
            }
        }
    };
    var channelListSuccess = function (res) {
        if (res.data.rows.length > 0) {
            //设置选中的默认单位
            if ("" == domainId) {
                domainId = data.data.rows[0].id;
            }
        }
    };
    var domainlist = CommonRemote.getDomainList(domainCbSuccess);
    var groupsAndroom = CommonRemote.getGroupsAndRoom();
    var chanellist = CommonRemote.getchanelList(channelListSuccess);
    initbtn("reload", groupsAndroom, domainlist, chanellist);
}

/*
* 初始化所有按钮
* */
function initbtn(type, groupsAndroom, domainlist, chanellist) {
    $("#jq").empty();
    for (let i in groupsAndroom) {
        $("#jq").append("<option class='jqli btn-text-3' value='" + groupsAndroom[i].id + "' id='jqli" + groupsAndroom[i].id + "'>" + groupsAndroom[i].name + "</option>");
    }

    $("#mrdw").empty();
    if (domainlist.length > 0) {
        for (let i in domainlist) {
            $("#mrdw").append("<option class='mrdwli btn-text-3' value='" + domainlist[i].id + "'id='mrdwli" + domainlist[i].id + "'>" + domainlist[i].name + "</option>");
        }
    } else {
        $("#mrdw").append("<option class='mrdwli btn-text-3'>无数据</option>");
    }

    //加载默认选中的监区
    var index = $("#jq")[0].selectedIndex;
    if (groupsAndroom.length > 0) {
        initJyContent(groupsAndroom[index].rooms);
    } else {
        $("#xjkzpanelbox").html("");
        $("#jq").append("<option class='jqli btn-text-3' >无数据</option>");
    }
    if ("reload" == type) {
        $("#mrdw").val(domainId);
    }
    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

/*
* 绑定事件
* */
function bindEvent(groups, domainlist, chanellist) {
    //给默认单位绑定事件
    $("#mrdw").bind("change", function () {
        domainId = $(this).val();
        reloadpage();
    });
    //给监区绑定事件
    $("#jq").bind("change", function () {
        var index = $(this)[0].selectedIndex;
        initJyContent(groups[index].rooms);
    });
    //播放
    $("#btn-play").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        videoCtrl(0, SelectedJyContent.RoomIds, 1);
    });
    //暂停
    $("#btn-pause").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        videoCtrl(0, SelectedJyContent.RoomIds, 2);
    });
    //静音
    $("#btn-mute").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        videoCtrl(0, SelectedJyContent.RoomIds, 3);
    });
    //停止
    $("#btn-stop").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        videoCtrl(0, SelectedJyContent.RoomIds, 4);
    });
    //音量
    $("#btn-volume").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        $(".volume-modal-sm").modal("show",{backdrop:'static',keyboard:false});
    });

    $("#btn-volume-confirm").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        volumeCtrlDlg(SelectedJyContent.RoomIds);
    });
    //发布公告
    $("#btn-gonggao").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        $(".gonggao-modal-sm").modal("show",{backdrop:'static',keyboard:false});
    });
    $("#btn-gonggao-confirm").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        gonggaoDlg(SelectedJyContent.RoomIds);
    });
    //插播
    $("#btn-chabo").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        $(".chabo-modal-sm").modal("show",{backdrop:'static',keyboard:false});
    });
    //插播直播
    $("#chabo_zhibo").bind("click", function () {
        $("#zhibo_endtime").val(CustumTimeUtil.convertTimeIntToString2(new Date().getTime() + 30 * 60 * 1000));
        $('#chabo-zhibo-modal-lg').modal("show",{backdrop:'static',keyboard:false});
        initZhiBoTalbe();
    });
    //插播直播确认按钮
    $("#btn-chabo-zhibo-confirm").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        insertPlayDlg(SelectedJyContent.RoomIds);
    });

    //插播点播
    $("#chabo_dianbo").bind("click", function () {
        var vodresourcegrouplist = CommonRemote.getVodResourceGroup();
        for (let i in vodresourcegrouplist) {
            $('#vodPlayModel').append("<option value=\"" + vodresourcegrouplist[i].id + "\" class=\"btn-text-3\">" + vodresourcegrouplist[i].name + "</option>");
        }
        $("#vodResourceGroupId").val($("#vodPlayModel").val());
        $('#vodPlayModel').bind("change", function () {
            $("#vodResourceGroupId").val($(this).val());
        });
        //IE下兼容  不可省略
        $('.selectpicker').selectpicker('refresh');
        $('.selectpicker').selectpicker('render');
        $("#dianbo_endtime").val(CustumTimeUtil.convertTimeIntToString2(new Date().getTime() + 30 * 60 * 1000));
        $('#chabo-dianbo-s1-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });

    //插播点播时 切换播放模式
    $("#playtype").bind("change", function () {
        changeHtml(".playtype-" + $(this).val());
    });

    //点击选择按钮时
    $("#select-video").bind("click", function () {
        //选择视频页面
        var vodresourcegrouplist = CommonRemote.getVodResourceGroup();
        initVodResourceGroup(vodresourcegrouplist);
        initVodResource();
        $("#xzsp-modal-lg").modal("show",{backdrop:'static',keyboard:false});
    });
    //点击搜索按钮时
    $("#searchbtn").bind("click", function () {
        debugger;
        var name = $("#searchName").val();
        var option = {
            silent: true,
            query: {
                groupId: 0,
                name: name,
                pageSize: 20,
                pageNumber: 1
            }
        };
        $("#vodresource").bootstrapTable("refresh", option);
    });

    //选择视频确认按钮
    $("#btn-xzsp-confirm").bind("click", function () {
        selectVodConfirm();
    });
    //插播点播确认按钮
    $("#btn-chabo-dianbo-confirm").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        insertPlayVodDlg(SelectedJyContent.RoomIds);
    });
    //取消插播
    $("#chabo_cancel").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        chaboCancel(SelectedJyContent.RoomIds);
        $(".chabo-modal-sm").modal("hide");
    });

    //预案控制
    $("#btn-yakz").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        $("#yakz-modal-sm").modal("show",{backdrop:'static',keyboard:false});
    });
    //停止预案
    $("#btn-yakz-stop").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        planCtrl(false, SelectedJyContent.RoomIds);
    });
    //恢复预案
    $("#btn-yakz-resume").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        planCtrl(true, SelectedJyContent.RoomIds);
    });
    //关机
    $("#btn-shutdown").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        powerCtrl(2, SelectedJyContent.RoomIds);
    });
    //开机
    $("#btn-startup").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        powerCtrl(1, SelectedJyContent.RoomIds);
    });
    //恢复
    $("#btn-resume").bind("click", function () {
        var SelectedJyContent = getSelectedjyContent();
        if (SelectedJyContent.RoomIds.length == 0) return;
        reset(SelectedJyContent.RoomIds);
    });
    //全选
    $("#btn-pickall").bind("click", function () {
        pickall();
    })
}

/*
* 初始化监狱监室
* */
function initJyContent(rooms) {
    clearJyContent();
    for (let i in rooms) {
        new JyEntry(rooms[i]).init1();
    }
}

/*
* 清空监狱监室
* */
function clearJyContent() {
    $("#xjkzpanelbox").empty();
}

/*
* 初始化左侧分组列表
* */
function initVodResourceGroup(vodresourcegrouplist) {
    //加载前先清空
    $(".body-left-list").empty();
    for (let i in vodresourcegrouplist) {
        $("#vodresourcegroup-list").append("<div id='vodresourcegroup_" + vodresourcegrouplist[i].id + "' class=\"list-item\">\n" +
            "                            <span class=\"list-item-text\">" + vodresourcegrouplist[i].name + "</span>\n" +
            "                        </div>");
    }
    //左侧视频分组绑定事件
    $(".list-item").bind("click", function () {
        $(".list-item").removeClass("list-item-active")
        $(this).addClass("list-item-active");
        var groupsid = $(this).attr("id").split("_")[1];
        var option = {
            silent: true,
            query: {
                groupId: groupsid,
                name: "",
                pageSize: 20,
                pageNumber: 1
            }
        };
        $("#vodresource").bootstrapTable("refresh", option);
    });
}

/*
* 设置查询参数
* */
function VodResourceGroupQueryParams(params) {
    debugger;
    var param = {};
    if (null != params) {
        param = params;
    }
    return (param);
}


/*
* 初始化直播列表
* */
function initZhiBoTalbe() {
    $("#table_zhibo").bootstrapTable({
        url: CustumCommonUtil.basePath + "/config/findChannelList.do",         //请求后台的URL（*）
        ajaxOptions: {
            xhrFields: {
                withCredentials: true // 这里设置了withCredentials 解决跨域问题
            }
        },
        method: 'post',                      //请求方式（*）
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        paginationPreText: "上页",           //上一页按钮
        paginationNextText: "下页",           //下一页按钮
        queryParams: "",//传递参数（*）
        clickToSelect: true,                //是否启用点击选中行
        singleSelect: true,                 //单选
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageSize: 20,                       //每页的记录行数（*）
        pageList: [10, 20, 30, 40],        //可供选择的每页的行数（*）
        height: 350,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        responseHandler: function (res) {   //接口返回结果预处理
            return res.data.rows;
        },
        onLoadSuccess: function (data) {
            debugger;
        },
        onClickRow: function (row, obj) {
            $(obj).parent().children().removeClass("row-selected");
            $(obj).addClass("row-selected");
            $("#channelId").val(row.id);
        },
        columns: [{
            title: '',
            width: 10,
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'id',
            visible: false
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'type',
            title: '类型',
            formatter: function (value, row) {
                switch (value) {
                    case 1:
                        value = "直播";
                        break;
                    case 2:
                        value = "点播";
                        break;
                    case 3:
                        value = "宣讲";
                        break;
                    case 4:
                        value = "DVD";
                        break;
                    default:
                        value = "无";
                }
                return value;
            }
        }]
    });
}

/*
* 初始化视频列表
* */
function initVodResource() {
    $("#vodresource").bootstrapTable({
        url: CustumCommonUtil.basePath + "/video/vodresource/search.do",         //请求后台的URL（*）
        ajaxOptions: {
            xhrFields: {
                withCredentials: true // 这里设置了withCredentials 解决跨域问题
            }
        },
        method: 'get',                      //请求方式（*）
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        paginationPreText: "上页",           //上一页按钮
        paginationNextText: "下页",           //下一页按钮
        showJumpto: true,
        queryParams: "VodResourceGroupQueryParams",//传递参数（*）
        clickToSelect: true,                //是否启用点击选中行
        singleSelect: true,
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        sortName: 'sortValue',
        order: "adescsc",
        limit: 1,                       // 需要配置 否则 是undefined
        offset: 10,        // 需要配置 否则 是undefined
        pageSize: 20,                       //每页的记录行数（*）
        pageList: [10, 20, 30, 40],        //可供选择的每页的行数（*）
        height: 320,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        responseHandler: function (res) {   //接口返回结果预处理
            return res.data.list;
        },
        onLoadSuccess: function (data) {
            debugger;
        },
        onClickRow: function (row, obj) {
            $(obj).parent().children().removeClass("row-selected");
            $(obj).addClass("row-selected");
            $("#vodResourceId").val(row.id);
            $("#vodResourceName").val(row.name);
            $("#vodResourceName_alias").val(row.name);
        },
        columns: [{
            title: '',
            width: 10,
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'id',
            visible: false
        }, {
            field: 'name',
            title: '名称',
            width: 60
        }, {
            field: 'times',
            title: '时长',
            width: 10
        }, {
            field: 'rtspUrl',
            title: '播放地址',
            visible: false
        }, {
            field: 'createTimeString',
            title: '上传时间',
            width: 20
        }]
    })
    ;
}

/*
* 点击监室触发
* */
function jycontentClick(obj) {
    if (obj.classList.contains("jycontentactive")) {
        obj.classList.remove("jycontentactive");
        obj.childNodes[1].childNodes[1].classList.remove("jy-logo-active")
        obj.childNodes[1].childNodes[2].classList.remove("jy-name-active")
        obj.childNodes[1].childNodes[1].classList.add("jy-logo")
        obj.childNodes[1].childNodes[2].classList.add("jy-name")
    } else {
        obj.classList.add("jycontentactive");
        obj.childNodes[1].childNodes[1].classList.remove("jy-logo")
        obj.childNodes[1].childNodes[2].classList.remove("jy-name")
        obj.childNodes[1].childNodes[1].classList.add("jy-logo-active")
        obj.childNodes[1].childNodes[2].classList.add("jy-name-active")
    }
}

/*
* 全选功能
* */
function pickall() {
    if ($(".jycontent").hasClass("jycontentactive")) {
        $(".jycontent").removeClass("jycontentactive");
        $(".jy-logo").removeClass("jy-logo-active");
        $(".jy-name").removeClass("jy-name-active");
    } else {
        $(".jycontent").addClass("jycontentactive");
        $(".jy-logo").addClass("jy-logo-active");
        $(".jy-name").addClass("jy-name-active");
    }
}

/*
* 获取选择的监室
* */
function getSelectedjyContent() {
    var selectedJyContent = {};
    var RoomIds = new Array();
    if ($(".jycontentactive").length != 0) {
        selectedJyContent.contents = $(".jycontentactive");
        $(".jycontentactive").each(function () {
            RoomIds.push($(this).attr("id").split('_')[2]);
        });
    } else {
        CustumCommonUtil.showMsg("请选择监室");
    }
    selectedJyContent.RoomIds = RoomIds;
    return selectedJyContent;
}

/*
* 切换播放模式时改变页面元素样式
* playtype播放模式  0-->顺序播放    2-->指定播放
* */
function changeHtml(playtype) {
    $(".changearea").hide();
    $(playtype).show();
}

/*
* 视频控制
* opType:0指定房间(仅支持0)
* videoCtrlType 1播放;2暂停;3静音; 4停止
* */
function videoCtrl(opType, roomIds, videoCtrlType) {
    var cbSuccess = function (res) {
        CustumCommonUtil.showMsg("操作成功");
        updateRoomStatus(CommonRemote.getGroupsAndRoom());
    };
    CommonRemote.xjkz.video.videoCtrl(opType, domainId, roomIds, videoCtrlType, cbSuccess);
}

/*
* 电源控制
* opType : 类型。0指定房间（只支持0）
* roomIds ： int[] 房间ID数组
* opt:操作类型 1开机 2关机
*/
function powerCtrl(opt, roomIds) {
    var cbSuccess = function (res) {
        CustumCommonUtil.showMsg("操作成功");
        updateRoomStatus(CommonRemote.getGroupsAndRoom());
    };
    if (opt == 1) {
        CommonRemote.xjkz.power.poweron(0, domainId, roomIds, cbSuccess);
    } else if (opt == 2) {
        CommonRemote.xjkz.power.poweroff(0, domainId, roomIds, cbSuccess);
    }
}

/*
* 音量控制
*/
function volumeCtrlDlg(roomIds) {
    var volume = $("#volume-input").val();
    if (volume == null || volume.length <= 0) {
        CustumCommonUtil.showMsg("请输入音量");
        return;
    }
    if (volume < 0 || volume > 100) {
        CustumCommonUtil.showMsg("请输入正确的音量", "200", "50");
        return;
    }
    var cbSuccess = function (res) {
        $(".volume-modal-sm").modal("hide");
        CustumCommonUtil.showMsg("操作成功");
        updateRoomStatus(CommonRemote.getGroupsAndRoom());
    };
    var cbFailed = function (res) {
        $(".volume-modal-sm").modal("hide");
    };

    CommonRemote.xjkz.video.volumeCtrl(0, domainId, roomIds, volume, volume, cbSuccess, cbFailed);//第一个volume表示机顶盒音量，第二个volume表示 广播音量

}

/*
* 发布公告
* */
function gonggaoDlg(roomIds) {
    var gonggaoConten = $("#gonggaoConten").val();
    var gonggaotime = $("#gonggaotime").val();
    gonggaoConten = $.trim(gonggaoConten);
    if (gonggaoConten == null || gonggaoConten.length <= 0) {
        CustumCommonUtil.showMsg("请输入公告内容");
        return;
    }
    if (gonggaotime != null) {
        gonggaotime = gonggaotime * 60;
    }
    var cbSuccess = function (res) {
        $(".gonggao-modal-sm").modal("hide");
        CustumCommonUtil.showMsg("操作成功");
        updateRoomStatus(CommonRemote.getGroupsAndRoom());
    };
    var cbFailed = function (res) {
        $(".gonggao-modal-sm").modal("hide");
    };
    CommonRemote.xjkz.video.showNotice(0, domainId, roomIds, gonggaoConten, gonggaotime, cbSuccess, cbFailed);

}

/*
* 预案控制
* */
function planCtrl(enable, roomIds) {
    var cbSuccess = function (res) {
        $(".yakz-modal-sm").modal("hide");
        CustumCommonUtil.showMsg("操作成功");
        updateRoomStatus(CommonRemote.getGroupsAndRoom());
    };
    var cbFailed = function (res) {
        $(".yakz-modal-sm").modal("hide");
    };
    CommonRemote.xjkz.video.planCtrl(domainId, roomIds, enable, cbSuccess, cbFailed);
}

/*
* 插播直播
* */
function insertPlayDlg(roomIds) {
    //var opType = $("#insertPlayDlg_opType").val();
    var opType = 1;
    if (opType <= 0) {
        return;
    }
    var chlId = $("#channelId").val();
    if (chlId == "" || chlId == null || chlId <= 0) {
        CustumCommonUtil.showMsg("请选择频道");
        return;
    }
    var endtime = $("#zhibo_endtime").val();
    if (endtime == "" || endtime == null || endtime.length < 0) {
        CustumCommonUtil.showMsg("必须指定结束时间");
        return;
    }
    var st_array = null;
    var endHH = 0;
    var endmm = 0;
    var endss = 0;
    if (endtime.length > 0) {
        st_array = endtime.split(":");
        endHH = st_array[0];
        endmm = st_array[1];
        endss = st_array[2];
        var now = new Date();
        var startHH = now.getHours();
        var startmm = now.getMinutes();
        var startss = now.getSeconds();
        var times = endHH * 3600 + endmm * 60 + endss - startHH * 3600 + startmm * 60 + startss;
        if (times <= 30) {
            CustumCommonUtil.showMsg("插播时长至少30秒以上");
            return null;
        }
    }
    if (opType == 1) {
        var cbSuccess = function (res) {
            $("#chabo-zhibo-modal-lg").modal("hide");
            var successCount = res.data.successCount;
            var fail = roomIds.length - successCount;
            if (fail > 0) {
                CustumCommonUtil.showMsg("部分插播失败，总数[" + roomIds.length + "], 失败[" + fail + "]，原因：" + res.result, "400px", "50px");
            }
            updateRoomStatus(CommonRemote.getGroupsAndRoom());
        };
        var cbFailed = function (res) {
            $("#chabo-zhibo-modal-lg").modal("hide");
        };
        //插播
        CommonRemote.xjkz.video.insertPlay(0, domainId, chlId, roomIds, endtime, cbSuccess, cbFailed);
    }
}

/*
* 选择视频后回填
* */
function selectVodConfirm() {
    var vodResourceGroup = $("#vodresourcegroup-list>.list-item-active");
    if ("" == $("#vodResourceId").val()) {
        CustumCommonUtil.showMsg("请选择视频");
        return;
    }
    var vodResourceGroupId = vodResourceGroup.length != 0 ? vodResourceGroup.attr("id").split("_")[1] : "";
    $("#vodResourceGroupId").val(vodResourceGroupId);
    $("#xzsp-modal-lg").modal("hide");
}

/*
* 插播点播
* */
function insertPlayVodDlg(roomIds) {
    var data = getDlgDataOfInsertPlayVodDlg(roomIds);
    var cbSuccess = function (res) {
        $("#chabo-dianbo-s1-modal-sm").modal("hide");
        var successCount = res.data.successCount;
        var fail = roomIds.length - successCount;
        if (fail > 0) {
            CustumCommonUtil.showMsg("部分插播失败，总数[" + roomIds.length + "], 失败[" + fail + "]，原因：" + res.result, "400px", "100px");
        }
        updateRoomStatus(CommonRemote.getGroupsAndRoom());
    };
    CommonRemote.xjkz.video.insertPlayVod(data, cbSuccess);
}

/*
* 获取窗口上的数据
* */
function getDlgDataOfInsertPlayVodDlg(roomIds) {
    var endtime = $("#dianbo_endtime").val();
    var st_array = null;
    var endHH = 0;
    var endmm = 0;
    var endss = 0;
    if (endtime.length > 0) {
        st_array = endtime.split(":");
        endHH = st_array[0];
        endmm = st_array[1];
        endss = st_array[2];
    }
    var vodPlayModel = $("#playtype").val();
    var vodResourceGroupId = $("#vodResourceGroupId").val();
    var vodResourceId = $("#vodResourceId").val();
    var vodResourceName = $("#vodResourceName").val();

    if (vodPlayModel == 2) {//2表示指定视频
        if (vodResourceId == "") {
            $("#vodResourceName").focus();
            CustumCommonUtil.showMsg("请选择点播视频", "200px", "50px");
            return null;
        }
    } else {
        if (vodResourceGroupId == null || vodResourceGroupId == "") {
            CustumCommonUtil.showMsg("请选择点播列表", "200px", "50px");
            return null;
        }
    }

    if (endtime.length > 0) {
        var now = new Date();
        var startHH = now.getHours();
        var startmm = now.getMinutes();
        var startss = now.getSeconds();
        var times = endHH * 3600 + endmm * 60 + endss - startHH * 3600 + startmm * 60 + startss;
        if (times <= 30) {
            CustumCommonUtil.showMsg("插播时长至少30秒以上", "200px", "50px");
            return null;
        }
    }

    var progData = new Object();
    progData.roomIds = roomIds;
    progData.endtime = endtime;
    progData.vodPlayModel = vodPlayModel;
    progData.vodResourceGroupId = vodResourceGroupId;
    progData.vodResourceId = vodResourceId;
    progData.vodResourceName = vodResourceName;
    return progData;

}

/*
* 取消插播
* */
function chaboCancel(roomIds) {
    var cbSuccess = function (res) {
        CustumCommonUtil.showMsg("操作成功");
        updateRoomStatus(CommonRemote.getGroupsAndRoom());
    };
    CommonRemote.xjkz.video.cancelInsertPlay(0, domainId, roomIds, cbSuccess);
}

/*
* 恢复自动控制
* */
function reset(roomIds) {
    var cbSuccess = function (res) {
        CustumCommonUtil.showMsg("操作成功");
        updateRoomStatus(CommonRemote.getGroupsAndRoom());
    };
    CommonRemote.xjkz.video.reset(0, domainId, roomIds, cbSuccess);
}