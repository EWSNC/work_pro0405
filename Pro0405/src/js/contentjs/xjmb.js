//单位ID
var domainId = "";
//固定参数
var groupId = 0;//模板ID
$(function () {
    initpage();
})

/*
* 初始化页面
* */
function initpage() {
    var domainlist = CommonRemote.getDomainList();
    var channelList = CommonRemote.getchanelList();
    var vodresourcegrouplist = CommonRemote.getVodResourceGroup();
    var broadcastResource = CommonRemote.loadBroadcastResource();
    initbtn(domainlist, channelList, vodresourcegrouplist, broadcastResource);
    bindEvent(domainlist, channelList, vodresourcegrouplist, broadcastResource);

}

/*
* 初始化按钮
* */
function initbtn(domainlist, channelList, vodresourcegrouplist, broadcastResource) {
    CommonRemote.xjya.loadTemplateList(initTmplate);
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
    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

/*
* 绑定事件
* */
function bindEvent(domainlist, channelList, vodresourcegrouplist, broadcastResource) {
    //增加模板
    $("#template-add").bind("click", function () {
        showTmltOptDlg("增加模板", 1, "", "", "");
        $("#btn-tmplt-opt-confirm").unbind();
        $("#btn-tmplt-opt-confirm").bind("click", function () {
            submitTemplate();
        });
    });
    //编辑模板
    $("#template-edit").bind("click", function () {
        var $tmpltactive = $(".tmplt-active");
        if ($tmpltactive != null) {
            var templateid = $tmpltactive.attr("templateid");
            if (templateid == null || templateid <= 0) {
                return;
            }
            var type = $tmpltactive.attr("templateType");
            var name = $tmpltactive.attr("templateName");
            showTmltOptDlg("编辑模板", 3, templateid, type, name);
            $("#btn-tmplt-opt-confirm").unbind();
            $("#btn-tmplt-opt-confirm").bind("click", function () {
                submitTemplate();
            });
        }
    });
    //删除模板
    $("#template-del").bind("click", function () {
        var templateid = $(".tmplt-active").attr("templateid");
        $("#tmplt-common-modal-title-text").html("删除模板");
        $("#btn-optdialog-delete-confirm").unbind();
        $("#btn-optdialog-delete-confirm").bind("click", function () {
            var cbSuccess = function (res) {
                CommonRemote.xjya.loadTemplateList(initTmplate)
                $('.optdialog-delete-modal-sm').modal("hide");
            };
            CommonRemote.xjya.deleteTemplate(templateid, cbSuccess);
        });
        $('.optdialog-delete-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });
    //复制模板
    $("#template-copy").bind("click", function () {
        var $tmpltactive = $(".tmplt-active");
        var templateid = $tmpltactive.attr("templateid");
        if (templateid == null || templateid <= 0) {
            return;
        }

        var name = $tmpltactive.attr("templateName");
        $("#tmplt_templateId2").val(templateid);
        $("#templateName2").val(name);

        $("#tmplt-common-modal-title-text").html("复制模板到");
        $("#templateName_box,#templateType_box").hide();
        $("#copytemplateName_box").show();
        $("#btn-tmplt-opt-confirm").unbind();
        $("#btn-tmplt-opt-confirm").bind("click", function () {
            var id = $("#tmplt_templateId2").val();
            var name = $("#templateName2").val();
            var cbSuccess = function (res) {
                var id = res.data.template.id;
                CommonRemote.xjya.loadTemplateList(initTmplate);
                $('.tmplt-opt-modal-sm').modal("hide");
            };
            CommonRemote.xjya.submitCopy(id, name, cbSuccess);
        });
        $('.tmplt-opt-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });
    //应用模板
    $("#template-apply").bind("click", function () {
        var $tmpltactive = $(".tmplt-active");
        var templateid = $tmpltactive.attr("templateid");
        var applyGroupNumber = $tmpltactive.attr("applyGroupNumber");
        var applyRoomNumber = $tmpltactive.attr("applyRoomNumber");
        $('#dlg_apply_templateId').val(templateid);
        if (applyGroupNumber > 0) {
            $("input[type=radio][name='dlg_apply_type'][value='1']").prop("checked", true);
        } else if (applyRoomNumber > 0) {
            $("input[type=radio][name='dlg_apply_type'][value='2']").prop("checked", true);
        } else {
            $("input[type=radio][name='dlg_apply_type'][value='0']").prop("checked", true);
        }
        changeApplyType(templateid);
        $('.optdialog-apply-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });
    //应用模板对话框切换单位
    $("#dw").bind("change", function () {
        domainId = $(this).val();
        var $tmpltactive = $(".tmplt-active");
        var templateid = $tmpltactive.attr("templateid");
        changeApplyType(templateid);
    });
    //应用模板对话框切换应用方式
    $("input[type=radio][name='dlg_apply_type']").bind("change", function () {
        var $tmpltactive = $(".tmplt-active");
        var templateid = $tmpltactive.attr("templateid");
        changeApplyType(templateid);
    });
    //应用模板对话框确认按钮
    $("#btn-optdialog-apply-confirm").bind("click", function () {
        applyTemplateToDomain();
        $('.optdialog-apply-modal-sm').modal("hide");
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

/*
* 点击模板时改变选中状态
* */
function changeSelectCss(obj) {
    $(".tmplt-item").removeClass("tmplt-active");
    $(obj).addClass("tmplt-active");
    tmpltClick(obj);
}

/*
* 点击模板时触发
* */
function tmpltClick(obj) {
    clearmain();
    var templateId = $(obj).attr("templateid");
    groupId = templateId;
    CommonRemote.xjya.loadTemplate(templateId, initProgramPlan);
}

/*
* 点击应用对话框监区展开logo时改变显示状态
* */
function changeSelectCss2(obj) {
    /*
    //点击应用对话框监室时改变选中状态(已废弃)
    //JyEntry.prototype.init3调用 (已废弃)
    var $jqjyitem = $(obj);
    if ($jqjyitem.hasClass("jq-title")) {   //有jq-title代表点击了监区
        var $jy_item = $jqjyitem.parent().find(".jy-item");
        if ($jqjyitem.hasClass("apply-active")) {
            $jqjyitem.removeClass("apply-active");
            $jy_item.removeClass("apply-active");
        } else {
            $jqjyitem.addClass("apply-active");
            $jy_item.addClass("apply-active");
        }
    } else {
        if ($jqjyitem.hasClass("apply-active")) {
            $jqjyitem.removeClass("apply-active");
        } else {
            $jqjyitem.addClass("apply-active");
        }
    }*/
    var $jqitem = $(obj);
    if ($jqitem.hasClass("jq-tip-open")) {
        $jqitem.parent().next().slideUp();
        $jqitem.removeClass("jq-tip-open");
        $jqitem.addClass("jq-tip");
    } else {
        $jqitem.parent().next().slideDown();
        $jqitem.removeClass("jq-tip");
        $jqitem.addClass("jq-tip-open");
    }
}

/*
* 点击应用对话框应用指定监室  监区CheckBox时触发
* */
function pickOrdisPickAll(obj) {
    var $checkboxitem = $(obj);
    if ($checkboxitem.is(':checked')) {
        $checkboxitem.parent().next().find(".jy-item > div > input[type='checkbox']").prop("checked", true);
    } else {
        $checkboxitem.parent().next().find(".jy-item > div > input[type='checkbox']").prop("checked", false);
    }

}

/*
* 切换应用方式
* */
function changeApplyType(templateid) {
    var value = $("input[type=radio][name='dlg_apply_type']:checked").val();
    if (value == "0") {
        $("#dlg_apply_type_box").slideUp();
    } else if (value == "1") {
        $("#dlg_apply_type_box").slideDown();
        initJqJyTree(false);
        var cbSuccess = function (res) {
            var list = res.data.list;
            for (var i = 0; i < list.length; i++) {
                var id = list[i];
                var selector = "#tmplt-jq-checkbox-" + id;
                $(selector).prop("checked", true);
            }
        };
        CommonRemote.xjya.loadRoomGroupsByTemplateId(templateid, cbSuccess);
    } else if (value == "2") {
        $("#dlg_apply_type_box").slideDown();
        initJqJyTree(true);
        var cbSuccess = function (res) {
            var list = res.data.list;
            for (var i = 0; i < list.length; i++) {
                var id = list[i];
                var selector = "#jy-checkbox-" + id;
                $(selector).prop("checked", true);
            }
        };
        CommonRemote.xjya.loadRoomsByTemplateId(templateid, cbSuccess);
    } else {
        CustumCommonUtil.showMsg("请选择一种应用类型");
    }
}

/*
* 清空详细列表
* */
function clearmain() {
    $("#plan-main").empty();
}

/*
* 初始化左侧模板列表
* */
function initTmplate(res) {
    var groups = res.data.list;
    var groupsHtml = "";
    var roomsHtml = "";
    $("#menu-bot").html(groupsHtml)
    if (groups.length > 0) {
        for (let i in groups) {
            var tmpltobj = new TempLateEntry(groups[i]);
            tmpltobj.init()
            if ("" == groupId && 0 == i) {
                $(tmpltobj.selector).addClass("tmplt-active");
                groupId = tmpltobj.id;
            }
        }
    }
    var selector = "#tmplt-item-" + groupId;
    $(selector).click();
}

/*
* 初始化应用对话框监区监狱列表
* */
function initJqJyTree(isOpen) {
    domainId = $('#dw').val();
    var groups = CommonRemote.getGroupsAndRoom();
    $("#jq-jy-area").empty();
    if (isOpen) {
        $("#jq-jy-area").append("<div class=\"alljq-tit\">\n" +
            "                            <span class=\"alljq-tit-text\">选择监室</span>\n" +
            "                        </div>");
    } else {
        $("#jq-jy-area").append("<div class=\"alljq-tit\">\n" +
            "                            <span class=\"alljq-tit-text\">选择监区</span>\n" +
            "                        </div>");
    }
    if (groups.length > 0) {
        for (let i in groups) {
            groups[i].isOpen = isOpen;
            var jqobj = new JqEntry(groups[i]);
            jqobj.init2()
        }
    }
}

/*
* 加载右侧计划详细
* */
function initProgramPlan(res) {
    window.templateId = res.data.template.id;
    var template = res.data.template;
    $("#plan-main").empty();
    if (template != null) {
        var programs = new Array();
        for (var i = 1; i < 8; i++) {
            var sindex = "program" + i;
            programs.push(JSON.parse(template[sindex]));
        }
        //根据当前时间初始化计划列表上日期显示
        var week = CustumTimeUtil.getWeek(new Date());
        for (let i in week) {
            new DayBoxEntry(week[i]).init2(programs[i], week[i], true, i);
        }
    }
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
    var templateId = $("#templateId").val();
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
        CustumCommonUtil.showMsg("结束时间不能早于开始时间");
        return;
    }
    if (type <= 0) {
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
    progData.templateId = templateId;
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

    var opType = $("#opType").val();
    if (opType == 1 || opType == 3) {//增、改
        var cbSuccess = function (res) {
            CommonRemote.xjya.loadTemplate(progData.templateId * 1, initProgramPlan);
            $(".optdialog-modal-sm").modal("hide")
        };
        CommonRemote.xjya.submit_create_template(opType, progData, cbSuccess);
    } else if (opType == 4) {//查

    }
}

/*
* 增加 编辑 模板
* */
function submitTemplate() {
    var opType = $("#tmplt_opType").val();
    var id = $("#tmplt_templateId").val();
    var type = $("#templateType").val();
    var name = $("#templateName").val();
    if (name == null || $.trim(name) == "") {
        CustumCommonUtil.showMsg("名称不能空");
        return;
    }
    var cbSuccess = function (res) {
        var id = res.data.template.id;
        CommonRemote.xjya.loadTemplateList(initTmplate);
        $('.tmplt-opt-modal-sm').modal("hide");
    };
    CommonRemote.xjya.submitTemplate(opType, id, type, name, cbSuccess)
}

//打开模板公用对话框
function showTmltOptDlg(title, optype, templateid, type, templateName) {
    $("#tmplt-opt-text-modal-title").html(title);
    $("#templateName_box,#templateType_box").show();
    $("#copytemplateName_box").hide();
    $("#tmplt_opType").val(optype);
    $("#tmplt_templateId").val(templateid);
    $("#templateType").val(type);
    $("#templateName").val(templateName);
    $('.tmplt-opt-modal-sm').modal("show",{backdrop:'static',keyboard:false});
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
    $("#vodResourceName_alias").val("");
    $("#broadcastresource").selectpicker("val", "");
    $("#programDesc").val("");
    $("#volume").val(20);
}

/*
* 打开复制对话框
* */
function showCopyProgramModal(templateId, weekday, programIndex) {
    $("input[name='copyProgramDialog_day']").prop("checked", false);
    $("input[name='copyProgramDialog_day']").prop("disabled", false);
    $("#copyProgramDialog_templateId").val(templateId);
    $("#copyProgramDialog_weekday").val(weekday);
    $("#copyProgramDialog_day").val(day);
    $("#copyProgramDialog_programIndex").val(programIndex);
    $("input[name='copyProgramDialog_day'][value='" + weekday + "']").prop("disabled", true);
    $("#btn-optdialog-copy-confirm").bind("click", function () {
        var templateId = $("#copyProgramDialog_templateId").val();
        var sourceWeekday = $("#copyProgramDialog_weekday").val();
        var targetWeekdays = "";
        $("input[name='copyProgramDialog_day']").each(function () {
            if (this.checked) {
                targetWeekdays += this.value + ",";
            }
        });
        var cbSuccess = function (res) {
            CommonRemote.xjya.loadTemplateList(initTmplate);
        };
        CommonRemote.xjya.submitCopyTmplateProgram(templateId, sourceWeekday, targetWeekdays, cbSuccess);
        $(".optdialog-copy-modal-sm").modal("hide");
    });
    $(".optdialog-copy-modal-sm").modal("show",{backdrop:'static',keyboard:false});
}

/*
* 应用模板确认事件
* */
function applyTemplateToDomain() {
    var value = $("input[name='dlg_apply_type']:checked").val();
    var templateId = $("#dlg_apply_templateId").val();
    var dlg_apply_override = $("#dlg_apply_override").is(':checked') ? 1 : 0;
    var domainId = $("#dw").val();
    if (value == "0") {
        var cbSuccess = function (res) {
            CommonRemote.xjya.loadTemplateList(initTmplate)
        };
        CommonRemote.xjya.applyTemplate2Domain(templateId, domainId, dlg_apply_override, cbSuccess);
    } else if (value == "1") {
        selectedRoomGroupsComplate(templateId, domainId, dlg_apply_override);
    } else if (value == "2") {
        selectedRoomsComplate(templateId, domainId, dlg_apply_override);
    }
}

/*
* 应用到监区
* */
function selectedRoomGroupsComplate(templateId, domainId, dlg_apply_override) {
    var $checkedGroup = $("#jq-jy-area").find(".jq-item > input[type='checkbox']:checked");
    if ($checkedGroup == null || $checkedGroup.length <= 0) {
        CustumCommonUtil.showMsg("请选择监区");
        return;
    }
    var roomGroupIds = new Array();
    for (var i = 0; i < $checkedGroup.length; i++) {
        var id = $($checkedGroup[i]).val();// $checkedGroup.get(i).value;
        roomGroupIds.push(id);
    }
    if (roomGroupIds.length > 0) {
        var cbSuccess = function (res) {
            CommonRemote.xjya.loadTemplateList(initTmplate)
        };
        CommonRemote.xjya.applyTemplate2RoomGroup(domainId, roomGroupIds.toString(), templateId, dlg_apply_override, cbSuccess);
    }
}

/*
* 应用到监室
* */
function selectedRoomsComplate(templateId, domainId, dlg_apply_override) {
    var $checkedRooms = $("#jq-jy-area").find(".jq-jy-tree-item > .jq-body > .jy-item > div > input[type='checkbox']:checked");
    //$("#jq-jy-area").find(".jq-item > input[type='checkbox']:checked");
    if ($checkedRooms == null || $checkedRooms.length <= 0) {
        CustumCommonUtil.showMsg("请选择监室");
        return;
    }
    var roomIds = new Array();
    for (var i = 0; i < $checkedRooms.length; i++) {
        var id = $($checkedRooms[i]).val();
        roomIds.push(id);
    }
    if (roomIds.length > 0) {
        var cbSuccess = function (res) {
            CommonRemote.xjya.loadTemplateList(initTmplate)
        };
        CommonRemote.xjya.applyTemplate2Room(domainId, roomIds.toString(), templateId, dlg_apply_override, cbSuccess);
    }

}