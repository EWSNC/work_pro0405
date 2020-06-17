//单位ID
var domainId = "";
$(function () {
    initpage();
});

function initpage() {
    initBtn();
    bindEvent();
    loadPropertyListTable();
}

function initBtn() {

    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

function bindEvent() {
    $("#btn-cssz-refresh").bind("click", function () {
        $("#table_cssz").bootstrapTable("refresh");
    });
    $("#btn-optdialog-confirm").bind("click", function () {
        dlg_submit();
    });
}

/*
* 加载单位表格
* */
function loadPropertyListTable() {
    $("#table_cssz").bootstrapTable({
        url: CustumCommonUtil.basePath + "/config/getPropertyList.do",         //请求后台的URL（*）
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
            title: '属性'
        }, {
            field: 'value',
            width: 100,
            title: '值'
        }, {
            field: 'description',
            width: 500,
            title: '描述'
        }, {
            title: '操作',
            width: 300,
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='editData(" + index + ")' style='cursor: pointer' title='修改'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
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
    var name = $('#dlg_name').html();
    var value = $('#dlg_value').val();
    var desc = $('#dlg_desc').html();
    var cbSuccess = function (res) {
        $("#table_cssz").bootstrapTable("refresh");
        $(".optdialog-modal-sm").modal("hide");
    };
    CommonRemote.xtpz.updatePropertyRow(name, value, desc, cbSuccess);
}

//编辑数据
function editData(index) {
    $("#table_cssz").bootstrapTable('uncheckAll');
    $("#table_cssz").bootstrapTable('check', index);
    var data = $("#table_cssz").bootstrapTable('getSelections')[0];
    clearAll();
    $('#dlg_name').html(data.name);
    $('#dlg_value').val(data.value);
    $('#dlg_desc').html(data.description);
    $("#common-modal-title-text").html("编辑");
    $(".optdialog-modal-sm").modal("show");
}

//清除所有填空内容
function clearAll() {
    $('#dlg_name').html('');
    $('#dlg_value').val('');
    $('#dlg_desc').html('');
}