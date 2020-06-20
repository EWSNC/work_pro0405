//固定参数
var vgroupId = 0;//视频分组ID
$(function () {
    initpage();
    initFtpObject();
});

/*
* 初始化Ftp
* */
function initFtpObject() {
    try {
        ftphelp.postCommand(1, '');
    } catch (e) {
    }
}

/*
* 初始化页面
* */
function initpage() {
    initbtn();
    bindEvent();
}

/*
* 初始化按钮
* */
function initbtn() {
    initvodresourcegroup();
    loadVodResourceTalbe();
    $('#file').fileinput({
        language: 'zh',
        showPreview: true,  //显示预览
        showBrowse: true,
        showUpload: false,   //上传按钮
        showRemove: true,   //移除按钮
        allowedFileExtensions: ['mp4'],  //允许文件上传类型
        showCaption: true,
        dropZoneEnabled: false //不显示拖拽上传区域
    }).on("filebatchselected", function (event, files) {//选择文件成功后
        $(".file-preview").addClass("file-preview-selfdefine-hide");
        var file = files[0];
        var filename = file.name;
        var filetype = file.type;
        if (filename.length >= 128) {
            CustumCommonUtil.showMsg("名称最多128个字");
            $(".fileinput-remove-button").click();
            return;
        }
        $("#dlg_name").val(filename);
        $("#dlg_resourceName").val(filename);
    });
    $('#file').bind("change", function () {
        $(".file-preview").removeClass("file-preview-selfdefine-hide");
        $(".file-preview-thumbnails").addClass("file-preview-selfdefine-hide");
    });

    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

/*
* 绑定事件
* */
function bindEvent(domainlist) {
    //增加视频分组
    $("#vgr-add").bind("click", function () {
        clearvgrDlgData();
        $("#dlgResourceGroup_opType").val(1);
        $("#btn-vgr-opt-confirm").unbind();
        $("#btn-vgr-opt-confirm").bind("click", function () {
            modifyvodGroup(1);
        });
        $("#vgr-opt-text-modal-title").html("增加分组");
        $('.vgr-opt-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });
    //编辑视频分组
    $("#vgr-edit").bind("click", function () {
        clearvgrDlgData();
        var $activevgr = $(".vodgroup-item-active");
        $('#dlgResourceGroup_id').val($activevgr.attr("id").replace("vodgroup-item-", ""));
        $('#dlgResourceGroup_name').val($activevgr.attr("name"));
        $('#dlgResourceGroup_sortValue').val($activevgr.attr("sortValue"));

        $("#btn-vgr-opt-confirm").unbind();
        $("#btn-vgr-opt-confirm").bind("click", function () {
            modifyvodGroup(2);
        });
        $("#vgr-opt-text-modal-title").html("编辑分组");
        $('.vgr-opt-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });
    //删除视频分组
    $("#vgr-del").bind("click", function () {
        clearvgrDlgData();
        var $activevgr = $(".vodgroup-item-active");
        $('#dlgResourceGroup_id').val($activevgr.attr("id").replace("vodgroup-item-", ""));
        $('#btn-optdialog-delete-confirm').unbind();
        $('#btn-optdialog-delete-confirm').bind("click", function () {
            modifyvodGroup(3);
        });
        $('.optdialog-delete-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    });
    //上传视频
    $("#btn-vod-add").bind("click", function () {
        addVodResource();
        $("#btn-upfile-confirm").unbind();
        $("#btn-upfile-confirm").bind("click", function () {
            doAddVodResource();
        });
    });


    //点击搜索按钮时
    $("#searchbtn").bind("click", function () {
        vgroupId = $(".vodgroup-item-active").attr("id").replace("vodgroup-item-", "");
        var name = $("#keyword").val();
        var option = {
            silent: true,
            query: {
                'groupId': vgroupId,
                'name': name,
                pageSize: 20,
                pageNumber: 1
            }
        };
        $("#table_dbsp").bootstrapTable("refresh", option);
    });

}

/*
* 初始化左侧视频分组
* */
function initvodresourcegroup() {
    var vodresourcegrouplist = CommonRemote.getVodResourceGroup();
    $("#menu-bot").empty();
    if (vodresourcegrouplist.length > 0) {
        for (var i = 0; i < vodresourcegrouplist.length; i++) {
            var vgroupobj = new VideoEntry(vodresourcegrouplist[i]);
            vgroupobj.init();
            if (0 == i) {
                $(vgroupobj.selector).addClass("vodgroup-item-active");
                vgroupId = vgroupobj.id;
            }
        }
        var selector = "#vodgroup-item-" + vgroupId;
        $(selector).click();
    } else {
        $("#table_dbsp").bootstrapTable("removeAll");
    }

    $('#dlg_group').empty();
    if (vodresourcegrouplist.length > 0) {
        for (let i in vodresourcegrouplist) {
            $("#dlg_group").append("<option class='btn-text-3' value='" + vodresourcegrouplist[i].id + "' id='vodresourcegrouplist" + vodresourcegrouplist[i].id + "'>" + vodresourcegrouplist[i].name + "</option>");
        }
    } else {
        $("#dlg_group").append("<option value='nodata' class='dwli btn-text-3'>无数据</option>");
    }
    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

/*
* 点击分组时改变选中状态  并且刷新表格
* */
function changeSelectCss(obj) {
    $(".vodgroup-item").removeClass("vodgroup-item-active");
    $(obj).addClass("vodgroup-item-active");
    vgroupId = $(obj).attr("id").replace("vodgroup-item-", "");
    var name = $("#keyword").val();
    var option = {
        silent: true,
        query: {
            'groupId': vgroupId,
            'name': name,
            pageSize: 20,
            pageNumber: 1
        }
    };
    $("#table_dbsp").bootstrapTable("refresh", option);
}

/*
* 设置查询参数
* */
function queryParams(params) {
    var param = {};
    if (null != params) {
        if (!params.search) {
            var $activevg = $(".vodgroup-item-active");
            var groupid = "";
            var name = "";
            if ($activevg.length > 0) {
                groupid = $activevg.attr("id").replace("vodgroup-item-", "");
                name = $("#keyword").val();
            }
            params['groupId'] = groupid;
            params['name'] = name;
        }
        param = params;
    }
    return (param);
}

/*
* 加载视频列表
* */
function loadVodResourceTalbe() {
    $("#table_dbsp").bootstrapTable({
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
            return res.data.list;
        },
        onLoadSuccess: function (data) {
        },
        onClickRow: function (row, obj) {
            $(obj).parent().children().removeClass("row-selected");
            $(obj).addClass("row-selected");
        },
        onDblClickRow: function (row, $element, field) {
            showDlgResourceDetail(row);
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
            field: 'name',
            title: '名称',
            width: 200
        }, {
            field: 'times',
            title: '时长',
            width: 80,
            formatter: function (value, rowData, rowIndex) {
                var firstVideo = rowData.firstVodResourceVideo;
                if (firstVideo != null) {
                    var times = CustumTimeUtil.convertTimeIntToString(firstVideo.times);
                    var html = "<span title=\"" + times + "\">" + times + "</span>"
                    return html;
                }
            }
        }, {
            field: 'rtspUrl',
            title: '播放地址',
            width: 200,
            formatter: function (value, rowData, rowIndex) {
                var firstVideo = rowData.firstVodResourceVideo;
                if (firstVideo != null) {
                    var urls = firstVideo.rtspUrl;
                    if (firstVideo.rtmpUrl != null) {
                        urls += "<br/>" + firstVideo.rtmpUrl;
                    }
                    var title = urls;
                    var html = "<span title=\"" + title + "\">" + urls + "</span>"
                    return html;
                } else {
                    return "&nbsp;";
                }
            }
        }, {
            field: 'createTimeString',
            title: '上传时间',
            width: 200
        }, {
            title: '操作',
            width: 100,
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='updateData(" + index + ")' style='cursor: pointer' title='修改'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
                btnhtml += "<span onclick='deleteData(" + index + ")' style='cursor: pointer;margin-left: 8px;' title='修改'><span class='icon-del'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>删除</a></span>";
                return btnhtml;
            }
        }]
    })
    ;
}

/*
* 增加 修改 删除视频分组
* */
function modifyvodGroup(mod) {//mod为方法参数，1为增加，2为修改，3为删除
    var name = $("#dlgResourceGroup_name").val();
    var sortValue = $("#dlgResourceGroup_sortValue").val();
    var cbSuccess = function (res) {
        initvodresourcegroup();
        $('.vgr-opt-modal-sm').modal("hide");
        $('.optdialog-delete-modal-sm').modal("hide");
    };
    if (mod != 3 && (name == null || name == "")) {
        CustumCommonUtil.showMsg("分组名称不能为空");
        return;
    }
    if (mod == 1) {
        CommonRemote.xtpz.requestAddVodResourceGroup(name, sortValue, cbSuccess);
    } else if (mod == 2) {
        var id = $("#dlgResourceGroup_id").val();
        CommonRemote.xtpz.requestUpdateVodResourceGroup(id, name, sortValue, cbSuccess);
    } else if (mod == 3) {
        var id = $("#dlgResourceGroup_id").val();
        CommonRemote.xtpz.requestDeleteVodResourceGroup(id, cbSuccess);
    }
}


//上传视频
function addVodResource() {
    var isIE = window.ActiveXObject || "ActiveXObject" in window;
    if (!isIE) {
        CustumCommonUtil.showMsg("视频上传功能只能在IE内核的浏览器中使用，建议使用IE浏览器或360浏览器", null, "100px", null, 3000);
        return;
    }
    $("#dlg_id").val("");
    $("#dlg_group").selectpicker("val", "");
    $("#dlg_uploadId").val("");
    $("#dlg_vodId").val("");
    $("#dlg_file").val("");
    $("#dlg_resourceName").val("");

    $("#dlg_opType").val(1);
    $("#file_box").show();
    $("#upfile-modal-title-text").html("上传视频");
    $(".upfile-modal-content").removeClass("upfile-modal-content-short").addClass("upfile-modal-content-normal");
    $(".upfile-modal-body").removeClass("upfile-modal-body-short").addClass("upfile-modal-body-normal");
    $(".upfile-modal-sm").modal("show",{backdrop:'static',keyboard:false});
}

//上传视频
function doAddVodResource() {
    var groupId = $("#dlg_group").val();
    if (groupId <= 0) {
        CustumCommonUtil.showMsg("请选择分组");
        return;
    }
    var resouceName = $("#dlg_resourceName").val();
    if (resouceName.length >= 128) {
        CustumCommonUtil.showMsg("名称最多128个字");
        return;
    }
    var cbSuccess = function (res) {
        var uploadList = res.data.uploadList;//多个上传信息
        CommonRemote.xtpz.ftpUpload.startUpload(uploadList);
    };
    CommonRemote.xtpz.prepareUploadInfo(name, cbSuccess);
}

//修改数据
function updateData(index) {
    $("#table_dbsp").bootstrapTable('uncheckAll');
    $("#table_dbsp").bootstrapTable('check', index);
    var rowData = $("#table_dbsp").bootstrapTable('getSelections')[0];

    $("#file_box").hide();
    $("#dlg_opType").val(2);
    $("#dlg_id").val(rowData.id);
    $("#dlg_group").selectpicker("val", rowData.vodResourceGroupId);
    $("#dlg_resourceName").val(rowData.name);
    $("#btn-upfile-confirm").unbind();
    $("#btn-upfile-confirm").bind("click", function () {
        doUpdateData(2);
    });
    $("#upfile-modal-title-text").html("修改视频描述");
    $(".upfile-modal-content").removeClass("upfile-modal-content-normal").addClass("upfile-modal-content-short");
    $(".upfile-modal-body").removeClass("upfile-modal-body-normal").addClass("upfile-modal-body-short");
    $(".upfile-modal-sm").modal("show",{backdrop:'static',keyboard:false});
}

//修改数据
function doUpdateData() {
    var id = $("#dlg_id").val();
    var groupId = $("#dlg_group").val();
    var name = $("#dlg_resourceName").val();
    var cbSuccess = function (res) {
        $("#table_dbsp").bootstrapTable("refresh");
        $(".upfile-modal-sm").modal("hide");
    };
    CommonRemote.xtpz.requestUpdateVodResource(id, groupId, name, cbSuccess);
}

//显示详情对话框
function showDlgResourceDetail(rowData) {
    var times = "";
    var urls = '';
    var videoSet = rowData.videoSet;
    var videoSetLength = videoSet != null ? videoSet.length : 0;
    if (videoSetLength > 0) {
        //新版本，从set中取资源
        for (var i = 0; i < videoSetLength; i++) {
            var video = videoSet[i];
            times = CustumTimeUtil.convertTimeIntToString(video.times);
            urls += "播放地址" + (i + 1) + ":";
            urls += "\n    时长:" + times;
            urls += "\n    " + video.rtspUrl;
            if (video.rtmpUrl != null) {
                urls += "\n    " + video.rtmpUrl;
            }
            urls += "\n";
        }
    } else {
        //老版本
        var video = rowData.firstVodResourceVideo;
        times = convertTimeIntToString(video.times);
        urls += "播放地址:";
        urls += "\n    时长:" + times;
        urls += "\n    " + video.rtspUrl;
        urls += "\n    " + video.rtmpUrl;
        urls += "\n";
    }

    $("#dlgResourceDetail_name").html(rowData.name);
    $("#dlgResourceDetail_times").html(times);
    $("#dlgResourceDetail_urls").html(urls);
    $("#dlgResourceDetail_createTime").html(rowData.createTimeString);
    $("#common-modal-title-text").html("详情");
    $('.optdialog-modal-sm').modal("show",{backdrop:'static',keyboard:false});
}

//删除视频
function deleteData(index) {
    $("#table_dbsp").bootstrapTable('uncheckAll');
    $("#table_dbsp").bootstrapTable('check', index);
    var id = row.id;
    $('.optdialog-delete-modal-sm').modal("show",{backdrop:'static',keyboard:false});
    $('#btn-optdialog-delete-confirm').unbind();
    $('#btn-optdialog-delete-confirm').bind("click", function () {
        var cbSuccess = function (res) {
            $('.optdialog-delete-modal-sm').modal("hide");
        };
        //CommonRemote.xtpz.deleteRoom(id, cbSuccess);
    });
}

//清除对话框内容
function clearvgrDlgData() {
    $('#dlgResourceGroup_id').val("");
    $('#dlgResourceGroup_opType').val("");
    $('#dlgResourceGroup_name').val("");
    $('#dlgResourceGroup_sortValue').val("");
}
