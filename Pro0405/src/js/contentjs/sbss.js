//单位ID
var domainId = "";
$(function () {
    initpage();
});

function initpage() {
    initBtn();
    bindEvent();
    loaddeviceListTable();
}

function initBtn() {

}

function bindEvent() {
    $("#btn-sbss-refresh").bind("click", function () {
        $("#table_sbss").bootstrapTable("refresh");
    });
}

/*
* 加载表格
* */
function loaddeviceListTable() {
    $("#table_sbss").bootstrapTable({
        url: CustumCommonUtil.basePath + "/sys/devicesearch/findList.do",         //请求后台的URL（*）
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
            return res.data.devices;
        },
        onLoadSuccess: function (data) {
        },
        onClickRow: function (row, obj) {
            $(obj).parent().children().removeClass("row-selected");
            $(obj).addClass("row-selected");
        },
        onDblClickRow: function (row, $element, field) {
            var index = $element.data('index');
            //editData(index);
        },
        columns: [{
            title: '',
            width: 50,
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'number',
            width: 100,
            title: '监室编号'
        }, {
            field: 'name',
            width: 100,
            title: '设备名称'
        }, {
            field: 'ip',
            width: 200,
            title: '设备IP'
        }, {
            field: 'uuid',
            width: 200,
            title: '设备编号'
        }, {
            field: 'deviceType',
            width: 200,
            title: '设备类型'
        }, {
            width: 100,
            title: '参数配置',
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='editData(" + index + ")' style='cursor: pointer' title='配置'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
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