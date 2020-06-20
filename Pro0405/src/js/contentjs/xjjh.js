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
    $('#daytime').datetimepicker({
        forceParse: 0,//设置为0，时间不会跳转1899，会显示当前时间。
        language: 'zh-CN',//显示中文
        format: 'yyyy-mm-dd',//显示格式
        minView: "month",//设置只显示到月份
        initialDate: new Date(),//初始化当前日期
        autoclose: true,//选中自动关闭
        todayBtn: true//显示今日按钮
    });

    $("#daytime").datetimepicker("setDate", new Date());  //设置显示默认当天的时间
    dayString = $("#daytime").val();
    //$("#starttime").datetimepicker("setDate", new Date(dayString));  //设置显示默认选中日期的时间
    var domainlist = CommonRemote.getDomainList();
    var channelList = CommonRemote.getchanelList();
    var vodresourcegrouplist = CommonRemote.getVodResourceGroup();
    var broadcastResource = CommonRemote.loadBroadcastResource();
    initbtn(domainlist, channelList, vodresourcegrouplist, broadcastResource);
    bindEvent(domainlist, channelList, vodresourcegrouplist, broadcastResource);
    CommonRemote.xjya.loadProgramPlan(initProgramPlan);
}

/*
* 初始化按钮
* */
function initbtn(domainlist, channelList, vodresourcegrouplist, broadcastResource) {
    $("#dw").empty();
    for (let i in domainlist) {
        $("#dw").append("<option class='dwli btn-text-3' value='" + domainlist[i].id + "' id='dwli" + domainlist[i].id + "'>" + domainlist[i].name + "</option>");
    }
    $("#channelList").empty();
    $('#channelList').append("<option value=\"\" class=\"btn-text-3\">请选择</option>");
    for (let i in channelList) {
        $("#channelList").append("<option class='dwli btn-text-3' value='" + channelList[i].id + "' id='dwli" + channelList[i].id + "'>" + channelList[i].name + "</option>");
    }
    $("#vodPlayList").empty();
    $('#vodPlayList').append("<option value=\"\" class=\"btn-text-3\">请选择</option>");
    for (let i in vodresourcegrouplist) {
        $('#vodPlayList').append("<option value=\"" + vodresourcegrouplist[i].id + "\" class=\"btn-text-3\">" + vodresourcegrouplist[i].name + "</option>");
    }
    $("#broadcastResourceList").empty();
    $('#broadcastResourceList').append("<option value=\"\" class=\"btn-text-3\">请选择</option>");
    for (let i in broadcastResource) {
        $('#broadcastResourceList').append("<option value=\"" + broadcastResource[i].id + "\" class=\"btn-text-3\">" + broadcastResource[i].name + "</option>");
    }

    //加载默认选中单位的数据
    var index = $("#dw")[0].selectedIndex;
    domainId = $("#dw").val();
    if ("" != domainId) {
        initJqAndJy();
    }
    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');

}

/*
* 绑定事件
* */
function bindEvent(domainlist, channelList, vodresourcegrouplist, broadcastResource) {
    //左侧日期选择改变
    $('#daytime').bind("change", function () {
        dayString = $(this).val();
        CommonRemote.xjya.loadProgramPlan(initProgramPlan);
    });
    //切换单位触发
    $("#dw").bind("change", function () {
        domainId = $(this).val();
        initJqAndJy();
    });

    //通用对话框事件绑定
    //节目类型改变
    $("#ptype").bind("change", function () {
        var value = $(this).val();
        ptypeChange(value);
    });
    //播放模式改变
    $("#playtype").bind("change", function () {
        var value = $(this).val();
        playtypeChange(value);
    });
    //选择电视频道
    $("#channelList").bind("change", function () {
        $("#programDesc").val($(this).find("option:selected")[0].innerText);
    });
    //选择点播列表
    $("#vodPlayList").bind("change", function () {
        $("#programDesc").val($(this).find("option:selected")[0].innerText);
    });
    //选择按钮
    $("#select-video").bind("click", function () {
        //选择视频页面
        var vodresourcegrouplist = CommonRemote.getVodResourceGroup();
        initVodResourceGroup(vodresourcegrouplist);
        initVodResource();
        $("#xzsp-modal-lg").modal("show",{backdrop:'static',keyboard:false})
    });
    //点击搜索按钮时
    $("#searchbtn").bind("click", function () {
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
    //对话框确认按钮
    $("#btn-optdialog-confirm").bind("click", function () {
        submit();
    });
}

//节目类型改变 改变样式
function ptypeChange(value) {
    $("#pchanellist_box,#pmodle_box,#plist_box,#pvodResource_box,#pgblist_box").hide();
    value = parseInt(value);
    if (value == 0) {                       //默认隐藏

    } else if (value == 1) {                //选中直播   显示电视频道
        $("#pchanellist_box").show();
    } else if (value == 2) {                //选中点播   显示播放模式和点播列表
        $("#pmodle_box").show();            //显示播放模式
        $("#plist_box,#pvodResource_box").hide();
        if ($("#playtype").val() == 0) {    //0表示顺序播放
            $("#plist_box").show();
        } else {                            //2表示指定播放
            $("#pvodResource_box").show();
        }
    } else if (value == 3) {                //选中广播   显示广播节目
        $("#pgblist_box").show();
    } else {
        $("#pchanellist_box,#plist_box,#pmodle_box,#pvodResource_box,#pgblist_box").hide();
    }
}

//播放模式 改变样式
function playtypeChange(value) {
    $("#plist_box,#pvodResource_box").hide();
    value = parseInt(value);
    if (value == 0) {                       //默认隐藏
        if ($("#ptype").val() == 2) {       //2表示节目类型是点播
            $("#plist_box").show();
        }
    } else if (value == 2) {                //选中直播   显示电视频道
        if ($("#ptype").val() == 1) {

        } else {
            $("#pvodResource_box").show();
        }

    } else {
        $("#plist_box,#pvodResource_box").hide();
    }
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
    var param = {};
    if (null != params) {
        param = params;
    }
    return (param);
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
        },
        onClickRow: function (row, obj) {
            $(obj).parent().children().removeClass("row-selected");
            $(obj).addClass("row-selected");
            $("#vodResourceId").val(row.id);
            $("#vodResourceName").val(row.name);
            $("#vodResourceName_alias").val(row.name);
            $("#programDesc").val(row.name);
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

//提交数据
function submit() {
    var groupId = $("#groupId").val() == "" ? 0 : $("#groupId").val();
    var roomId = $("#roomId").val() == "" ? 0 : $("#roomId").val();
    var programIndex = $("#programIndex").val();
    //开始时间
    var starttime = $("#starttime").val();
    var st_array = null;
    var startHH = 0;
    var startmm = 0;
    var startss = 0;
    if (starttime.length > 0) {
        st_array = starttime.split(":");
        startHH = st_array[0];
        startmm = st_array[1];
        startss = st_array[2];
    }

    //结束时间
    var endtime = $("#endtime").val();
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
    var type = $("#ptype").val();
    var chlId = $("#channelList").val();
    var vodPlayModel = $("#playtype").val();
    var vodResourceGroupId = $("#vodPlayList").val();
    var vodResourceId = $("#vodResourceId").val();
    var vodResourceName = $("#vodResourceName").val();
    var broadcastresource = $("#broadcastResourceList").val();
    var programDesc = $("#programDesc").val();
    var volume = $("#volume").val();
    if (parseInt(endHH) * 3600 + parseInt(endmm) * 60 + parseInt(endss) <= parseInt(startHH) * 3600 + parseInt(startmm) * 60 + parseInt(startss)) {
        CustumCommonUtil.showMsg("结束时间不能早于开始时间", "300px");
        return;
    }
    if (type <= 0) {
        $("#pType").focus();
        CustumCommonUtil.showMsg("请选择节目类型");
        return;
    }
    if (type == 1 && chlId <= 0) {//1直播
        CustumCommonUtil.showMsg("请选择电视频道");
        return;
    }
    if (type == 2) {//2点播
        if (vodPlayModel == 2) {//2表示指定视频
            if (vodResourceId == "") {
                CustumCommonUtil.showMsg("请选择点播视频");
                return;
            }
        } else {
            if (vodResourceGroupId == null || vodResourceGroupId == "") {
                CustumCommonUtil.showMsg("请选择点播列表")
                return;
            }
        }
    }

    if (type == 3 && broadcastresource <= 0) {//3广播
        CustumCommonUtil.showMsg("请选择广播节目");
        return;
    }

    var progData = new Object();
    progData.groupId = groupId;
    progData.roomId = roomId;
    progData.index = programIndex;
    progData.type = type;
    progData.starttime = startHH + ":" + startmm + ":" + startss;
    progData.endtime = endHH + ":" + endmm + ":" + endss;
    progData.channelId = chlId;
    progData.vodPlayModel = vodPlayModel;
    progData.vodResourceGroupId = vodResourceGroupId;
    progData.vodResourceId = vodResourceId;
    progData.vodResourceName = vodResourceName;
    progData.broadcastresource = broadcastresource;
    progData.desc = programDesc;
    progData.volume = volume;

    var day = $('#day').val();
    var opType = $("#opType").val();
    if (opType == 1 || opType == 3) {//增、改
        var cbSuccess = function (res) {
            CommonRemote.xjya.loadProgramPlan(initProgramPlan);
            $(".optdialog-modal-sm").modal("hide");
        };
        CommonRemote.xjya.submit_create(opType, progData, day, cbSuccess);
    } else if (opType == 4) {//查

    }
}

/*
* 点击监区和监室时改变选中状态
* */
function changeSelectCss(obj) {
    $(".jq-item-title,.jy-item").removeClass("jq-jy-active");
    $(obj).addClass("jq-jy-active");
    //如果点击的是监区
    if ($(obj).hasClass("jq-item-title")) {
        jqClick(obj);
    } else {//如果点击的是监室
        jyClick(obj);
    }
    clearmain();
}

/*
* 展开或者合上树
* */
function treeCtrl(obj) {
    //修改CSS样式，箭头方向，监室列表显隐
    if ($(obj).hasClass("jq-tip-open")) {
        $(obj).attr('class', "jq-tip");
        $(obj).parent().next().slideUp(300);
    } else {
        $(obj).attr('class', "jq-tip-open");
        $(obj).parent().next().slideDown(300);
    }
}

/*
* 点击监区触发
* */
function jqClick(obj) {
    groupId = $(obj).attr("id").replace("jq-item-title", "");
    roomId = 0;
    CommonRemote.xjya.loadProgramPlan(initProgramPlan);
}

/*
* 点击监室触发
* */
function jyClick(obj) {
    roomId = $(obj).attr("id").replace("jy-item", "");
    groupId = 0;
    CommonRemote.xjya.loadProgramPlan(initProgramPlan);
}

/*
* 清空详细列表
* */
function clearmain() {
    $("#plan-main").empty();
}

/*
* 初始化左侧监区和监室树形列表
* */
function initJqAndJy() {
    var groupsAndRoom = CommonRemote.getGroupsAndRoom();
    var groupsHtml = "";
    $("#menu-bot").html(groupsHtml)
    if (groupsAndRoom.length > 0) {
        for (let i in groupsAndRoom) {
            groupsAndRoom[i].isOpen = true;
            var jqobj = new JqEntry(groupsAndRoom[i]);
            jqobj.init()
            if (0 == i) {
                $(jqobj.selector).addClass("jq-jy-active");
                groupId = jqobj.id;
            }
            if (jqobj.isOpen) {
                var rooms = groupsAndRoom[i].rooms;
                for (let j in rooms) {
                    new JyEntry(rooms[j]).init2(groupsAndRoom[i]);
                }
            }
        }
    }
    //点击监区箭头触发
    $(".jq-tips").bind("click", function () {
        treeCtrl(this);
    });
}

/*
* 加载右侧计划详细
* */
function initProgramPlan(res) {
    var list = res.data.list;
    $("#plan-main").empty();
    //根据当前时间初始化计划列表上日期显示
    var week = CustumTimeUtil.getWeek(new Date(dayString));
    for (let i in week) {
        var isShowModal = false;
        var currentDate = new Date();
        var y = currentDate.getFullYear();
        var m = currentDate.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = currentDate.getDate();
        d = d < 10 ? "0" + d : d;
        var currentDatestr = y + "-" + m + "-" + d;
        if (!CustumTimeUtil.compareDayTime(week[i].resultDayTime, currentDatestr)) {
            isShowModal = true
        }
        new DayBoxEntry(week[i]).init1(list[i], week[i], isShowModal, i);
    }
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
    $("#programIndex").val("");
    $("#starttime").val("");
    $("#endtime").val("");
    $("#ptype").selectpicker("val", "0");
    ptypeChange("");
    $("#channelList").selectpicker("val", "");
    $("#playtype").selectpicker("val", "0");
    playtypeChange("0");
    $("#vodPlayList").selectpicker("val", "");
    $("#vodResourceId").val("");
    $("#vodResourceName").val("");
    $("#broadcastresource").selectpicker("val", "");
    $("#programDesc").val("");
    $("#volume").val(20); //默认值
}

/*
* 打开复制对话框
* */
function showCopyProgramModal(groupId, roomId, day, weekday, programIndex) {
    $("input[name='copyProgramDialog_day']").prop("checked", false);
    $("input[name='copyProgramDialog_day']").prop("disabled", false);
    $("#copyProgramDialog_groupId").val(groupId);
    $("#copyProgramDialog_roomId").val(roomId);
    $("#copyProgramDialog_day").val(day);
    $("#copyProgramDialog_programIndex").val(programIndex);
    $("input[name='copyProgramDialog_day'][value='" + weekday + "']").prop("disabled", true);
    $("#btn-optdialog-copy-confirm").bind("click", function () {
        var groupId = $("#copyProgramDialog_groupId").val();
        var roomId = $("#copyProgramDialog_roomId").val();
        var day = $("#copyProgramDialog_day").val();
        var programIndex = $("#copyProgramDialog_programIndex").val();
        var sourceWeekday = $("#copyProgramDialog_weekday").val();
        var targetWeekdays = "";
        $("input[name='copyProgramDialog_day']").each(function () {
            if (this.checked) {
                targetWeekdays += this.value + ",";
            }
        });
        var cbSuccess = function (res) {
            CommonRemote.xjya.loadProgramPlan(initProgramPlan);
            $(".optdialog-copy-modal-sm").modal("hide");
        };
        CommonRemote.xjya.submitCopyProgram(groupId, roomId, day, programIndex, sourceWeekday, targetWeekdays, cbSuccess);
    });
    $(".optdialog-copy-modal-sm").modal("show",{backdrop:'static',keyboard:false});
}