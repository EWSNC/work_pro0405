//单位ID
var domainId = "";
//固定参数
var groupId = 0;//分组ID
var roomId = 0;//房间ID
var dayString = "";//指定日期，格式yyyy-MM-dd
$(function () {
    initpage();
})

/*
* 初始化页面
* */
function initpage() {
    var domainlist = CommonRemote.getDomainList();
    initbtn(domainlist);
    bindEvent(domainlist);
    loadJsTalbe();
}

/*
* 初始化按钮
* */
function initbtn(domainlist) {
    $("#dw").empty();
    for (let i in domainlist) {
        $("#dw").append("<option class='dwli btn-text-3' value='" + domainlist[i].id + "' id='dwli" + domainlist[i].id + "'>" + domainlist[i].name + "</option>");
    }
    //加载默认选中单位的数据
    var index = $("#dw")[0].selectedIndex;
    domainId = $("#dw").val();
    if ("" != domainId) {
        initJq();
    }
    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

/*
* 绑定事件
* */
function bindEvent(domainlist) {
    //切换单位触发
    $("#dw").bind("change", function () {
        domainId = $(this).val();
        initJq();
    });
    //增加监区
    $("#jq-add").bind("click", function () {
        clearDlgData();
        $("#btn-jq-opt-confirm").unbind();
        $("#btn-jq-opt-confirm").bind("click", function () {
            modifyRoomGroup(1);
        });
        $("#jq-opt-text-modal-title").html("增加监区");
        $("#groupMod").val(1);
        $('.jq-opt-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });
    //编辑监区
    $("#jq-edit").bind("click", function () {
        clearDlgData();
        $("#jq-opt-text-modal-title").html("编辑监区");
        $("#groupMod").val(2);
        var $activeJq = $(".jq-jy-active");
        $('#jq_groupid').val($activeJq.attr("id").replace("jq-item-", ""));
        $('#updateGroupDialog-Name').val($activeJq.attr("name"));
        $('#updateGroupDialog-Number').val($activeJq.attr("number"));
        $('#updateGroupDialog-Notes').val($activeJq.attr("notes"));
        var color = $activeJq.attr("color");
        if (color) {
            color = color.toUpperCase();
            var selectstr = "input[type=radio][name='radio-mark'][value='" + color + "']";
            $(selectstr).prop("checked", true);
        }
        $("#btn-jq-opt-confirm").unbind();
        $("#btn-jq-opt-confirm").bind("click", function () {
            modifyRoomGroup(2);
        });
        $('.jq-opt-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });
    //删除监区
    $("#jq-del").bind("click", function () {
        $("#groupMod").val(3);
        var $activeJq = $(".jq-jy-active");
        $('#jq_groupid').val($activeJq.attr("id").replace("jq-item-", ""));
        $('.optdialog-delete-modal-sm').modal("show",{backdrop:'static',keyboard:false});
        $('#btn-optdialog-delete-confirm').unbind();
        $('#btn-optdialog-delete-confirm').bind("click", function () {
            modifyRoomGroup(3);
        });
    });
    //增加监室
    $("#btn-jspz-add").bind("click", function () {
        addService();
        $("#btn-jy-opt-confirm").unbind();
        $("#btn-jy-opt-confirm").bind("click", function () {
            modifyRoom(1);
        });
    });


    //点击搜索按钮时
    $("#Servicebtn").bind("click", function () {
        var name = $("#ServiceName").val();
        var option = {
            silent: true,
            query: {
                'room.roomGroup.id': groupId,
                'room.name': name,
                pageSize: 20,
                pageNumber: 1
            }
        };
        $("#table_jspz").bootstrapTable("refresh", option);
    });

}

/*
* 初始化左侧监区
* */
function initJq() {
    var groups = CommonRemote.getGroups();
    var groupsHtml = "";
    var roomsHtml = "";
    $("#menu-bot").html(groupsHtml);
    if (groups.length > 0) {
        for (let i in groups) {
            groups[i].isOpen = false;
            var jqobj = new JqEntry(groups[i]);
            jqobj.init3()
            if (0 == i) {
                $(jqobj.selector3).addClass("jq-jy-active");
                groupId = jqobj.id;
            }
        }
        $("#table_jspz").bootstrapTable("refresh");
    } else {
        $("#table_jspz").bootstrapTable("removeAll");
    }

}

/*
* 点击监区和监室时改变选中状态
* */
function changeSelectCss(obj) {
    $(".jq-item").removeClass("jq-jy-active");
    $(obj).addClass("jq-jy-active");
    groupId = $(obj).attr("id").replace("jq-item-", "");
    roomId = 0;
    var name = $("#ServiceName").val();
    var option = {
        silent: true,
        query: {
            'room.roomGroup.id': groupId,
            'room.name': name,
            pageSize: 20,
            pageNumber: 1
        }
    };
    $("#table_jspz").bootstrapTable("refresh", option);
}

/*
* 设置查询参数
* */
function queryParams(params) {
    var param = {};
    if (null != params) {
        if (!params.search) {
            var $activeJq = $(".jq-jy-active");
            var groupid = "";
            if ($activeJq.length > 0) {
                groupid = $activeJq.attr("id").replace("jq-item-", "");
            }
            params['room.roomGroup.id'] = groupid;
        }
        param = params;
    }
    return (param);
}

/*
* 初始化监室列表
* */
function loadJsTalbe() {
    $("#table_jspz").bootstrapTable({
        url: CustumCommonUtil.basePath + "/config/findRoomList.do",         //请求后台的URL（*）
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
        queryParams: "queryParams",//传递参数（*）
        clickToSelect: true,                //是否启用点击选中行
        singleSelect: true,
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        sortName: 'name',
        order: "asc",
        limit: 1,                       // 需要配置 否则 是undefined
        offset: 10,        // 需要配置 否则 是undefined
        pageSize: 20,                       //每页的记录行数（*）
        pageList: [10, 20, 30, 40],        //可供选择的每页的行数（*）
        height: 650,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        responseHandler: function (res) {   //接口返回结果预处理
            return res.data.rows;
        },
        onLoadSuccess: function (data) {
        },
        onClickRow: function (row, obj) {
            $(obj).parent().children().removeClass("row-selected");
            $(obj).addClass("row-selected");
        },
        onDblClickRow: function (row, $element, field) {
            var index = $element.data('index');
            updateService(index);
        },
        columns: [{
            title: '',
            width: 50,
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'id',
            visible: false
        }, {
            field: 'number',
            title: '编号',
            width: 60
        }, {
            field: 'name',
            title: '名称',
            width: 100
        }, {
            field: 'powerIP',
            title: '电源',
            width: 200
        }, {
            field: 'mssIP',
            title: '流媒体服务器',
            width: 200
        }, {
            field: 'bctID',
            title: '广播终端编号',
            width: 100
        }, {
            field: 'status',
            title: '状态',
            formatter: function (value, row, index) {
                var text = value == 1 ? "没人" : "正常";
                return text;
            },
            width: 60
        }, {
            title: '操作',
            width: 100,
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='updateService(" + index + ")' style='cursor: pointer' title='修改'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
                btnhtml += "<span onclick='deleteService(" + index + ")' style='cursor: pointer;margin-left: 8px;' title='修改'><span class='icon-del'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>删除</a></span>";
                return btnhtml;
            }
        }]
    })
    ;
}

/*
* 增加 修改 删除监区
* */
function modifyRoomGroup(mod) {//mod为方法参数，1为增加，2为修改，3为删除。
    var id = null;
    var name = null;
    var number = null;
    var notes = null;
    var color = null;

    if (mod == null) {
        mod = $("#groupMod").val();
    }

    var domainId = $("#dw").val();

    id = $('#jq_groupid').val();
    if (id == null || id == "") {
        if (mod != 1) {
            id = $('.jq-jy-active').attr('id').replace("jq-item-", "");
        }
    }
    name = $('#updateGroupDialog-Name').val();
    number = $('#updateGroupDialog-Number').val();
    notes = $('#updateGroupDialog-Notes').val();
    color = $("input[type=radio][name='radio-mark']:checked").val();
    var cbSuccess = function (res) {
        initJq();
        $('.jq-opt-modal-sm').modal("hide");
        $('.optdialog-delete-modal-sm').modal("hide");
    };
    CommonRemote.xtpz.modifyRoomGroup(mod, id, name, number, notes, color, domainId, cbSuccess);
}


//增加房间
function addService() {
    $("#roomDialog_Mod").val(1);
    $('#roomNumber').val("");
    $('#roomName').val("");
    $('#powerIP').val("");
    $('#powerPort').val("5000");
    $('#powerNumber').val("");
    $('#bctID').val("");
    $('#mssIP').val("");
    $('#status0').prop("checked", true);
    $('#jy-opt-text-modal-title').html("增加监室");
    $('.jy-opt-modal-sm').modal("show",{backdrop:'static',keyboard:false});
}

//修改房间
function updateService(index) {
    $("#table_jspz").bootstrapTable('uncheckAll');
    $("#table_jspz").bootstrapTable('check', index);
    var row = $("#table_jspz").bootstrapTable('getSelections')[0];
    $("#roomDialog_Mod").val(2);
    $('#roomNumber').val(row.number);
    $('#roomName').val(row.name);
    $('#powerIP').val(row.powerIP);
    $('#powerPort').val(row.powerPort != null ? row.powerPort : 5000);
    $('#powerNumber').val(row.powerNumber);
    $('#bctID').val(row.bctID);
    $('#mssIP').val(row.mssIP);
    if (row.status == 0) {
        $('#status0').attr("checked", "checked");
    } else {
        $('#status1').attr("checked", "checked");
    }
    $("#btn-jy-opt-confirm").unbind();
    $("#btn-jy-opt-confirm").bind("click", function () {
        modifyRoom(2);
    });
    $('#jy-opt-text-modal-title').html("修改监室");
    $('.jy-opt-modal-sm').modal("show",{backdrop:'static',keyboard:false});
}

function modifyRoom(mod) {
    var id = null;
    var number = null;
    var name = null;
    var powerIP = null;
    var powerPort = null;
    var powerNumber = null;
    var bctID = null;
    var mssIP = null;
    var status = 0;
    var roomGroupId = null;

    if (mod == null) {
        mod = $("#roomDialog_Mod").val();
    }
    if (mod != 1 && mod != 2) {
        return;
    }

    if (mod == 2) {
        //2修改
        var room = $("#table_jspz").bootstrapTable('getSelections')[0];
        id = room != null ? room.id : 0;
    }
    number = $('#roomNumber').val();
    if (number == null || number == "") {
        CustumCommonUtil.showMsg("请输入房间编号!");
        return;
    } else if (number.length > 6) {
        CustumCommonUtil.showMsg("房间编号为数字且最长6位");
        return;
    }

    if ($(".jq-jy-active").length == 1) {
        roomGroupId = $(".jq-jy-active").attr("id").replace("jq-item-", "");
    } else {
        CustumCommonUtil.showMsg("请先选择监区");
        return;
    }

    name = $('#roomName').val();
    if (name == null || name == "") {
        CustumCommonUtil.showMsg("请输入名称！");
        return;
    } else if (name.length > 32) {
        CustumCommonUtil.showMsg("名称最多为32个字符");
        return;
    }
    powerIP = $("#powerIP").val();
    // var match = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    var match = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (!match.test(powerIP)) {
        CustumCommonUtil.showMsg("电源控制器IP地址不正确!");
        return;
    }


    powerPort = $("#powerPort").val();
    if (!(/^\+?[1-9][0-9]*$/.test(powerPort))) {
        CustumCommonUtil.showMsg("端口号只能是数字");
        return;
    }
    powerNumber = $("#powerNumber").val();
    if (!(/^\+?[1-9][0-9]*$/.test(powerNumber))) {
        CustumCommonUtil.showMsg("电源开关编号只能是数字");
        return;
    }

    bctID = $('#bctID').val();
    if (!(/^\+?[1-9][0-9]*$/.test(bctID))) {
        CustumCommonUtil.showMsg("广播终端编号只能是数字!");
        return;
    }

    mssIP = $("#mssIP").val();
    if (mssIP != null && $.trim(mssIP).length > 0) {
        // var match = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        var match = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!match.test(mssIP)) {
            CustumCommonUtil.showMsg("流媒体服务器IP地址格式不正确!");
            return;
        }
    }
    status = $("input[name='status']:checked").val();
    if (number != null && number != '' && isNaN(number)) {
        CustumCommonUtil.showMsg("请输入正确格式的编号!", "250px");
        return;
    }
    if (roomGroupId == -1) {
        CustumCommonUtil.showMsg("请选择房间分组！");
        return;
    }
    var param = {
        roomGroupId: roomGroupId,
        id: id,
        number: number,
        name: name,
        powerIP: powerIP,
        powerPort: powerPort,
        powerNumber: powerNumber,
        bctID: bctID,
        mssIP: mssIP,
        status: status,
        mod: mod
    };
    var cbSuccess = function (res) {
        $("#table_jspz").bootstrapTable("refresh");
        $('.jy-opt-modal-sm').modal("hide");
    };
    CommonRemote.xtpz.modifyRoom(param, cbSuccess)
}

//删除房间
function deleteService(index) {
    $("#table_jspz").bootstrapTable('uncheckAll');
    $("#table_jspz").bootstrapTable('check', index);
    var row = $("#table_jspz").bootstrapTable('getSelections')[0];
    var id = row.id;
    $('.optdialog-delete-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    $('#btn-optdialog-delete-confirm').unbind();
    $('#btn-optdialog-delete-confirm').bind("click", function () {
        var cbSuccess = function (res) {
            $('.optdialog-delete-modal-sm').modal("hide");
        };
        CommonRemote.xtpz.deleteRoom(id, cbSuccess);
    });
}

//加载指定的节目
function loadDlgData(p) {
    $("#programIndex").val(p.index);
    $("#starttime").val(p.starttime);
    $("#endtime").val(p.endtime);
    $("#ptype").selectpicker("val", p.type);
    ptypeChange(p.type);
    $("#channelList").selectpicker("val", p.channelId <= 0 ? "" : p.channelId);
    $("#playtype").selectpicker("val", p.vodPlayModel <= 0 ? "0" : p.vodPlayModel);
    playtypeChange(p.vodPlayModel);
    $("#vodPlayList").selectpicker("val", p.vodResourceGroupId <= 0 ? "" : p.vodResourceGroupId);
    $("#vodResourceId").val(p.vodResourceId);
    $("#vodResourceName").val(p.vodResourceName);
    $("#vodResourceName_alias").val(p.vodResourceName);
    $("#broadcastresource").selectpicker("val", p.broadcastresource <= 0 ? "" : p.broadcastresource);
    $("#programDesc").val(p.desc);
    $("#volume").val(p.volume);
}

//清除对话框内容
function clearDlgData() {
    $('#groupMod').val("");
    $('#jq_groupid').val("");
    $('#updateGroupDialog-Name').val("");
    $('#updateGroupDialog-Number').val("");
    $('#updateGroupDialog-Notes').val("");
    $("input[type=radio][name='radio-mark']").prop("checked", false);
}
