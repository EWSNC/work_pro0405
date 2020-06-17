//单位ID
var domainId = "";
$(function () {
    initpage();
});

function initpage() {
    initBtn();
    bindEvent();
    loadbroadcastresourceTable();
}

function initBtn() {
    $('#file').fileinput({
        language: 'zh',
        showPreview: true,  //显示预览
        showBrowse: true,
        showUpload: false,   //上传按钮
        showRemove: true,   //移除按钮
        allowedFileExtensions: ['mp3'],  //允许文件上传类型
        showCaption: true,
        dropZoneEnabled: false //不显示拖拽上传区域
    }).on("filebatchselected", function (event, files) {//选择文件成功后
        $(".file-preview-thumbnails").removeClass("file-preview-selfdefine-hide");
        /*var file = files[0];
        var filename = file.name;
        var filetype = file.type;
        if (filetype != "audio/mpeg" && !CustumCommonUtil.strEndWith(filename, ".mp3")) {
            CustumCommonUtil.showMsg("只能上传mp3文件");
            //移除文件
            $(".fileinput-remove-button").click();
        }*/
        var file = files[0];
        var filename = file.name;
        var filetype = file.type;
        if (filename.length >= 32) {
            CustumCommonUtil.showMsg("名称最多64个字");
            $(".fileinput-remove-button").click();
            return;
        }
        $("#dlg_name").val(filename);
    });
    $('#file').bind("change", function () {
        $(".file-preview").removeClass("file-preview-selfdefine-hide");
        $(".file-preview-thumbnails").addClass("file-preview-selfdefine-hide");
    });

    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

function bindEvent() {
    $("#btn-gbjm-add").bind("click", function () {
        clearAll();
        $("#dlg_opType").val(1);
        $("#file_box").show();
        $("#btn-upfile-confirm").unbind();
        $("#btn-upfile-confirm").bind("click", function () {
            dlg_submit();
        });
        $("#upfile-modal-title-text").html("上传");
        $(".upfile-modal-content").removeClass("upfile-modal-content-short").addClass("upfile-modal-content-normal");
        $(".upfile-modal-body").removeClass("upfile-modal-body-short").addClass("upfile-modal-body-normal");
        $(".upfile-modal-sm").modal("show");
    });

    $("#btn-optdialog-delete-confirm").bind("click", function () {
        doDeleteData();
    });

}

/*
* 加载单位表格
* */
function loadbroadcastresourceTable() {
    $("#table_gbjm").bootstrapTable({
        url: CustumCommonUtil.basePath + '/config/broadcastresource/findByPage.do',         //请求后台的URL（*）
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
        sortName: 'sortValue',
        order: "adescsc",
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
            $(obj).parent().children().removeClass("selected");
            $(obj).addClass("selected");
        },
        onDblClickRow: function (row, $element, field) {
            var index = $element.data('index');
            editData(index);
        },
        columns: [{
            title: '',
            width: 50,
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'name',
            width: 200,
            title: '名称'
        }, {
            field: 'file',
            width: 200,
            title: '文件'
        }, {
            field: 'createtime',
            width: 200,
            title: '上传时间'
        }, {
            title: '操作',
            width: 300,
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='editData(" + index + ")' style='cursor: pointer' title='修改'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
                btnhtml += "<span onclick='deleteData(" + index + ")' style='cursor: pointer;margin-left: 8px;' title='修改'><span class='icon-del'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>删除</a></span>";
                return btnhtml;
            }
        }]
    })
    ;

}

/*
* 设置查询参数
* */
function queryParams(params) {
    var param = {};
    if (null != params) {
        param = params;
    }
    return (param);
}

//提交对话框的数据
function dlg_submit() {
    var opType = $("#dlg_opType").val();
    var filename = $("#dlg_name").val();
    if (filename.trim() == "") {
        CustumCommonUtil.showMsg("请输入文件名称");
        return;
    }
    if (opType == 1) {
        var file = $("#file").val();
        if (file == "") {
            CustumCommonUtil.showMsg("请选择文件");
            return;
        }
        var cbSuccess = function (res) {
            $("#table_gbjm").bootstrapTable("refresh");
            $(".upfile-modal-sm").modal("hide");
        };
        CommonRemote.xtpz.request_Add_broadcastresource(filename, cbSuccess);
    } else if (opType == 2) {
        var id = $("#dlg_id").val();
        var cbSuccess = function (res) {
            $("#table_gbjm").bootstrapTable("refresh");
            $(".upfile-modal-sm").modal("hide");
        };
        CommonRemote.xtpz.request_Update_broadcastresource_name(id, filename, cbSuccess);
    }
}

//编辑用户
function editData(index) {
    $("#table_gbjm").bootstrapTable('uncheckAll');
    $("#table_gbjm").bootstrapTable('check', index);
    var rowData = $("#table_gbjm").bootstrapTable('getSelections')[0];

    clearAll();
    $("#dlg_rowIndex").val(index);
    $("#dlg_id").val(rowData.id);
    $("#dlg_name").val(rowData.name);
    $("#file_box").hide();
    $(".upfile-modal-content").removeClass("upfile-modal-content-normal").addClass("upfile-modal-content-short");
    $(".upfile-modal-body").removeClass("upfile-modal-body-normal").addClass("upfile-modal-body-short");
    $("#dlg_opType").val(2);//opType:1增加、2修改
    $("#btn-upfile-confirm").unbind();
    $("#btn-upfile-confirm").bind("click", function () {
        dlg_submit();
    });
    $("#upfile-modal-title-text").html("编辑");
    $(".upfile-modal-sm").modal("show");
}

function deleteData(index) {
    $("#table_gbjm").bootstrapTable('uncheckAll');
    $("#table_gbjm").bootstrapTable('check', index);
    $(".optdialog-delete-modal-sm").modal("show");
}

function doDeleteData() {
    var data = $("#table_gbjm").bootstrapTable('getSelections')[0];
    var id = data.id;
    var cbSuccess = function (res) {
        $("#table_gbjm").bootstrapTable("refresh");
        $(".optdialog-delete-modal-sm").modal("hide");
    };
    CommonRemote.xtpz.request_delete_broadcastresource_byid(id, cbSuccess)
}

//清除所有填空内容
function clearAll() {
    $("#dlg_form")[0].reset();
}