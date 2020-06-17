//单位ID
var domainId = "";
$(function () {
    initpage();
});

function initpage() {
    initBtn();
    bindEvent();
    loadLmtfwqListTable();
}

function initBtn() {

    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

function bindEvent() {
    $("#btn-lmtfwq-refresh").bind("click", function () {
        $("#table_lmtfwq").bootstrapTable("refresh");
    });
    $("#btn-lmtfwq-add").bind("click", function () {
        clearAll();
        $("#common-modal-title-text").html("增加");
        $("#opType").val(0);//0表示添加
        $(".optdialog-modal-sm").modal("show");
    });
    $("#btn-optdialog-confirm").bind("click", function () {
        dlg_submit();
    });
    $("#btn-optdialog-delete-confirm").bind("click", function () {
        doDeleteLmtfwqData();
    });

}

/*
* 加载单位表格
* */
function loadLmtfwqListTable() {
    $("#table_lmtfwq").bootstrapTable({
        url: CustumCommonUtil.basePath + "/video/mssinfo/list.do",         //请求后台的URL（*）
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
            return res.data.rows;
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
            field: 'ip',
            width: 200,
            title: 'IP'
        }, {
            field: 'version',
            width: 200,
            title: '版本',
            formatter: function (value, rowData, rowIndex) {
                if (value == 0) {
                    return "V1.0（MSS流媒体服务器）";
                } else if (value == 1) {
                    return "V2.0（宣教主机）";
                } else if (value == 21) {
                    return "V2.1（宣教主机）";
                } else {
                    return value;
                }
            }
        }, {
            title: '操作',
            width: 300,
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='editData(" + index + ")' style='cursor: pointer' title='修改'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
                btnhtml += "<span onclick='deleteLmtfwqData(" + index + ")' style='cursor: pointer;margin-left: 8px;' title='修改'><span class='icon-del'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>删除</a></span>";
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
    var opType = $('#opType').val();//opType:0增加，1修改
    var mssId = $('#mssId').val();
    var mssName = $('#mssName').val();
    var mssIP = $('#mssIP').val();
    var mssUsername = $("#mssUsername").val();
    var mssPassword = $("#mssPassword").val();
    var mssVersion = $("#mssVersion").val();
    var match = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (!match.test(mssIP)) {
        CustumCommonUtil.showMsg("IP格式不正确");
        return;
    }
    if (mssVersion < 0) {
        CustumCommonUtil.showMsg("请选择流媒体版本");
        return;
    }

    var opType = $("#opType").val();
    var cbSuccess = function (res) {
        $("#table_lmtfwq").bootstrapTable("refresh");
        $(".optdialog-modal-sm").modal("hide");
    };
    CommonRemote.xtpz.submitlmtfwqData(opType, mssId, mssName, mssIP, mssUsername, mssPassword, mssVersion, cbSuccess);
}

//编辑数据
function editData(index) {
    $("#table_lmtfwq").bootstrapTable('uncheckAll');
    $("#table_lmtfwq").bootstrapTable('check', index);
    var mss = $("#table_lmtfwq").bootstrapTable('getSelections')[0];

    clearAll();
    $('#opType').val('1');
    $('#mssId').val(mss.id);
    $('#mssName').val(mss.name);
    $('#mssIP').val(mss.ip);
    $('#mssUsername').val(mss.username);
    $('#mssPassword').val(mss.password);
    $('#mssVersion').selectpicker("val", mss.version);

    $("#common-modal-title-text").html("编辑");
    $(".optdialog-modal-sm").modal("show");
}

//向服务器删除指定行
function deleteLmtfwqData(index) {
    $("#table_lmtfwq").bootstrapTable('uncheckAll');
    $("#table_lmtfwq").bootstrapTable('check', index);

    $(".optdialog-delete-modal-sm").modal("show");
}

function doDeleteLmtfwqData() {
    var mss = $("#table_lmtfwq").bootstrapTable('getSelections')[0];
    var id = mss.id;
    var cbSuccess = function (res) {
        $("#table_lmtfwq").bootstrapTable("refresh");
        $(".optdialog-delete-modal-sm").modal("hide");
    };
    CommonRemote.xtpz.deletelmtfwqDataById(id, cbSuccess)

}

//清除所有填空内容
function clearAll() {
    $('#opType').val('');
    $('#mssId').val('');
    $('#mssName').val('');
    $('#mssIP').val('');
    $('#mssUsername').val('');
    $('#mssPassword').val('');
    $('#mssVersion').selectpicker("val", -1);
}