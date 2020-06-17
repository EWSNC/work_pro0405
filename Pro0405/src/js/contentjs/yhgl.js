//单位ID
var domainId = "";
$(function () {
    initpage();
});

function initpage() {
    var domainlist = CommonRemote.getDomainList();
    initBtn(domainlist);
    bindEvent();
    loadUserListTable();
}

function initBtn(domainlist) {
    $("#dw").empty();
    if (domainlist.length > 0) {
        for (let i in domainlist) {
            $("#dw").append("<option class='dwli btn-text-3' value='" + domainlist[i].id + "' id='dwli" + domainlist[i].id + "'>" + domainlist[i].name + "</option>");
        }
    } else {
        $("#dw").append("<option value='nodata' class='dwli btn-text-3'>无数据</option>");
    }
    //加载默认选中单位的监区
    var mrdw = $("#dw").val();
    if (mrdw != "nodata") {
        domainId = mrdw;
        initJqSelect();
    } else {
        $("#jq").append("<option class='jqli btn-text-3' >无数据</option>");
    }

    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}

function bindEvent() {
    //给单位绑定事件
    $("#dw").bind("change", function () {
        domainId = $(this).val();
        initJqSelect();
    });

    $("#btn-user-add").bind("click", function () {
        clearAll();
        $("#common-modal-title-text").html("增加用户");
        $("#dlg_opType").val(1);//1表示添加
        $(".optdialog-modal-sm").modal("show");
    });
    $("#btn-optdialog-confirm").bind("click", function () {
        dlg_submit();
    });
    $("#btn-optdialog-delete-confirm").bind("click", function () {
        doDeleteUser();
    });

}

/*
* 加载单位表格
* */
function loadUserListTable() {
    $("#table_yhgl").bootstrapTable({
        url: CustumCommonUtil.basePath + "/config/userList.do",         //请求后台的URL（*）
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
            return res.data.users;
        },
        onLoadSuccess: function (data) {
        },
        onClickRow: function (row, obj) {
            $(obj).parent().children().removeClass("selected");
            $(obj).addClass("selected");
        },
        onDblClickRow: function (row, $element, field) {
            var index = $element.data('index');
            editUser(index);
        },
        columns: [{
            title: '',
            width: 50,
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'fullname',
            width: 200,
            title: '姓名'
        }, {
            field: 'username',
            width: 200,
            title: '登陆账户'
        }, {
            field: 'domain',
            width: 200,
            title: '单位',
            formatter: function (value, row, index) {
                return value == null ? "" : value.name;
            }
        }, {
            title: '操作',
            width: 300,
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='editUser(" + index + ")' style='cursor: pointer' title='修改'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
                btnhtml += "<span onclick='deleteUser(" + index + ")' style='cursor: pointer;margin-left: 8px;' title='修改'><span class='icon-del'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>删除</a></span>";
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

/*
* 根据单位初始化监区下拉选项
* */
function initJqSelect() {
    var groups = CommonRemote.getGroups();
    $("#jq").empty();
    if (groups.length > 0) {
        for (let i in groups) {
            $("#jq").append("<option class='jqli btn-text-3' value='" + groups[i].id + "' id='dwli" + groups[i].id + "'>" + groups[i].name + "</option>");
        }
    } else {
        $("#jq").append("<option class='jqli btn-text-3'>无数据</option>");
    }
    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
}


//校验并返回对话框的数据
function validDialogData() {
    var id = $("#dlg_id").val();
    var domainId = $("#dw").val();
    var roomGroupIds = $("#jq").val();
    var fullname = $("#dlg_fullname").val();
    if ("" == $.trim(fullname) || $.trim(fullname).lenght <= 0) {
        CustumCommonUtil.showMsg("用户名称不能为空");
        return null;
    }
    var username = $("#dlg_username").val();
    if ("" == $.trim(username) || $.trim(username).lenght <= 0) {
        CustumCommonUtil.showMsg("登录帐号不能为空");
        return null;
    }
    var password1 = $("#dlg_password1").val();
    var password2 = $("#dlg_password2").val();
    if (password1 != password2) {
        CustumCommonUtil.showMsg("两次密码不一样");
        return null;
    }

    var user = new Object();
    user.domainId = domainId;
    user.roomGroupIds = roomGroupIds;
    user.id = id;
    user.fullname = fullname;
    user.username = username;
    user.password1 = password1;
    user.password2 = password2;
    return user;

}

//提交对话框的数据
function dlg_submit() {
    var user = validDialogData();
    if (user == null) {
        return;
    }
    var opType = $("#dlg_opType").val();
    var cbSuccess = function (res) {
        $(".optdialog-modal-sm").modal("hide");
        $("#table_yhgl").bootstrapTable("refresh");
    };
    CommonRemote.xtpz.modifyUser(user, opType, cbSuccess);
}

//编辑用户
function editUser(index) {
    $("#table_yhgl").bootstrapTable('uncheckAll');
    $("#table_yhgl").bootstrapTable('check', index);
    var user = $("#table_yhgl").bootstrapTable('getSelections')[0];
    if (user.superAdmin) {
        //超级管理员信息不能编辑
        CustumCommonUtil.showMsg("超级管理员信息不能编辑", "300px")
        return;
    }

    clearAll();
    domainId = user.domain.id;
    $("#dw").selectpicker("val", domainId);
    initJqSelect();
    var roomGroupIds = user.roomGroupIds;
    $("#jq").selectpicker("val", roomGroupIds);
    $("#dlg_id").val(user.id);
    $("#dlg_fullname").val(user.fullname);
    $("#dlg_username").val(user.username);
    $("#dlg_opType").val(2);//opType:1增加、2修改
    $("#common-modal-title-text").html("编辑用户");
    $(".optdialog-modal-sm").modal("show");
}

//向服务器删除指定行
function deleteUser(index) {
    $("#table_yhgl").bootstrapTable('uncheckAll');
    $("#table_yhgl").bootstrapTable('check', index);
    var user = $("#table_yhgl").bootstrapTable('getSelections')[0];

    if (user.superAdmin) {
        CustumCommonUtil.showMsg("超级管理员不能删除")
        return;
    }
    $("#noticemsg-delete-user").html("您确认想要删除帐户<br>[" + user.fullname + "]吗？");
    $(".optdialog-delete-modal-sm").modal("show");
}

function doDeleteUser() {
    var user = $("#table_yhgl").bootstrapTable('getSelections')[0];
    var cbSuccess = function (res) {
        $("#table_yhgl").bootstrapTable("refresh");
        $(".optdialog-delete-modal-sm").modal("hide");
    };
    CommonRemote.xtpz.doDeleteUser(user, cbSuccess)

}

//清除所有填空内容
function clearAll() {
    $('#jq').selectpicker('deselectAll');
    $('#dlg_opType').val('');
    $('#dlg_id').val('');
    $('#dlg_fullname').val('');
    $('#dlg_username').val('');
    $('#dlg_password1').val('');
    $('#dlg_password2').val('');
}