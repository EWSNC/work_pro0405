$(function () {
    initpage();
    bindEvent();
});

function initpage() {
    loadDomainListTable();
}

function bindEvent() {
    $("#btn-dwpz-add").bind("click", function () {
        clearAll();
        $("#dwpz-opt-text-modal-title").html("增加单位信息");
        $("#opType").val(1);//1表示添加
        $(".dwpz-opt-modal-sm").modal("show");
    });
    //增加 编辑 对话框确认按钮
    $("#btn-dwpz-opt-confirm").bind("click", function () {
        submitData();
    });
    //删除 对话框 确认按钮
    $("#btn-optdialog-delete-confirm").bind("click", function () {
        doDeleteDomain();
    });
    //点击搜索按钮时
    $("#searchbtn").bind("click", function () {
        debugger;
        var name = $("#searchName").val();
        var option = {
            silent: true,
            query: {
                groupId: 0,
                "domain.name": name,
                pageSize: 10,
                pageNumber: 1
            }
        };
        $("#table_dwpz").bootstrapTable("refresh", option);
    });

}

/*
* 加载单位表格
* */
function loadDomainListTable() {
    $("#table_dwpz").bootstrapTable({
        url: CustumCommonUtil.basePath + "/config/findDomainList.do",         //请求后台的URL（*）
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
            editDomain(index);
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
            field: 'status',
            visible: false
        }, {
            field: 'type',
            visible: false
        }, {
            field: 'name',
            width: 1600,
            title: '名称'
        }, {
            title: '操作',
            width: 300,
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='editDomain(" + index + ")' style='cursor: pointer' title='修改'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
                btnhtml += "<span onclick='deleteDomain(" + index + ")' style='cursor: pointer;margin-left: 8px;' title='修改'><span class='icon-del'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>删除</a></span>";
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


function submitData() {
    var opType = $("#opType").val();
    var id = $("#domainId").val();
    var name = $("#domainName").val();
    if (name == null || $.trim(opType).length <= 0) {
        CustumCommonUtil.showMsg("单位名称不能为空");
        return;
    }
    var cbSuccess = function (res) {
        $(".dwpz-opt-modal-sm").modal("hide");
        $("#table_dwpz").bootstrapTable("refresh");
    };
    CommonRemote.xtpz.modifyDomain(opType, id, name, cbSuccess);
}

//修改
function editDomain(index) {
    debugger;
    $("#table_dwpz").bootstrapTable('uncheckAll');
    $("#table_dwpz").bootstrapTable('check', index);
    var domain = $("#table_dwpz").bootstrapTable('getSelections')[0];
    clearAll();
    $("#opType").val(2);//2表示更新
    $("#domainId").val(domain.id);
    $("#domainName").val(domain.name);
    $("#dwpz-opt-text-modal-title").html("编辑单位信息");
    $(".dwpz-opt-modal-sm").modal("show");
}

//删除
function deleteDomain(index) {
    $("#table_dwpz").bootstrapTable('uncheckAll');
    $("#table_dwpz").bootstrapTable('check', index);
    var domain = $("#table_dwpz").bootstrapTable('getSelections')[0];

    $("#noticemsg-delete-domain").html("您确认想要删除记录<br>[" + domain.name + "]吗？");
    $(".optdialog-delete-modal-sm").modal("show");
}

/*
* 执行删除
* */
function doDeleteDomain() {
    var domain = $("#table_dwpz").bootstrapTable('getSelections')[0];
    var cbSuccess = function (res) {
        $("#table_dwpz").bootstrapTable("refresh");
        $(".optdialog-delete-modal-sm").modal("hide");
    };
    CommonRemote.xtpz.doDeleteDomain(domain, cbSuccess);
}

//清除所有填空内容
function clearAll() {
    $('#opType').val('');
    $('#domainId').val('');
    $('#domainName').val('');
}