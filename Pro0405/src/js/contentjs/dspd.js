$(function () {
    initpage();
});

function initpage() {
    var vodserverList = CommonRemote.xtpz.lodeVodserver();
    initbtn(vodserverList);
    bindEvent();
    loadChannelListTable();
};

function initbtn(vodserverList) {
    $("#ChannelVodserver,#Dialog-Vodserver").empty();
    $("#ChannelVodserver,#Dialog-Vodserver").append("<option class=\"btn-text-3\" value=\"-1\">全部</option>");
    for (let i in vodserverList) {
        $("#ChannelVodserver").append("<option class='btn-text-3' value='" + vodserverList[i].id + "' id='dwli" + vodserverList[i].id + "'>" + vodserverList[i].name + "</option>");
    }
    //IE下兼容  不可省略
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
    //业务需求  隐藏
    $("#ChannelVodserver").selectpicker("hide");
}

function bindEvent() {
    //新建
    $("#btn-ds-add").bind("click", function () {
        $("#btn-ds-opt-confirm").unbind();
        $("#btn-ds-opt-confirm").bind("click", function () {
            modifyChannel(1)
        });
        clearAll();
        $("#ds-opt-text-modal-title").html("增加");
        $(".ds-opt-modal-sm").modal("show",{backdrop:'static',keyboard:false});
    });
    //删除
    $("#btn-optdialog-delete-confirm").bind("click", function () {
        modifyChannel(3);
    });
    $("#ChannelType,#ChannelVodserver").bind("change", function () {
        reloadTalbe();
    });
    //点击搜索按钮时
    $("#searchbtn").bind("click", function () {
        reloadTalbe();
    });
}

/*
* 加载单位表格
* */
function loadChannelListTable() {
    $("#table_dspd").bootstrapTable({
        url: CustumCommonUtil.basePath + "/config/findChannelList.do",         //请求后台的URL（*）
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
        sortName: 'id',
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
            updateChannel(index);
        },
        columns: [{
            title: '',
            width: 30,
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: 'id',
            visible: false
        }, {
            field: 'number',
            width: 50,
            title: '通道编号'
        }, {
            field: 'name',
            width: 100,
            title: '名称'
        }, {
            field: 'type',
            width: 50,
            title: '类型',
            formatter: function (value, rowData, index) {
                var html = '';
                if (value == 1) {
                    html = '直播';
                    return html;
                } else if (value == 2) {
                    html = '点播';
                    return html;
                } else if (value == 3) {
                    html = '宣讲';
                    return html;
                } else if (value == 4) {
                    html = 'DVD';
                    return html;
                } else {
                    html = '无';
                    return html;
                }
            }
        }, {
            field: 'url',
            width: 200,
            title: '视频源地址'
        }, {
            field: 'vodserverid',
            title: '点播服务器ID',
            visible: false
        }, {
            field: 'vodservername',
            title: '点播服务器名称',
            width: 200,
            formatter: function (value, rowData, index) {
                var html = '';
                if (value == null) {
                    html = '无';
                    return html;
                } else {
                    return value;
                }
            }
        }, {
            title: '操作',
            width: 100,
            formatter: function (value, row, index) {
                var btnhtml = "<span onclick='updateChannel(" + index + ")' style='cursor: pointer' title='修改'><span class='icon-edit'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>编辑</a></span>";
                btnhtml += "<span onclick='deleteChannel(" + index + ")' style='cursor: pointer;margin-left: 8px;' title='修改'><span class='icon-del'></span><a  style=' vertical-align: super; color: white; font-size: 18px; text-decoration: none;'>删除</a></span>";
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
        if (!params.search) {
            var ChannelName = $("#ChannelName").val();
            var ChannelType = $("#ChannelType").val();
            var ChannelVodserver = $("#ChannelVodserver").val();
            params['chl.name'] = ChannelName;
            params['chl.type'] = ChannelType;
            params['chl.vodserver.id'] = ChannelVodserver;
        }
        param = params;
    }
    return (param);
}

/*
* 根据参数   重载表格
* */
function reloadTalbe() {
    var ChannelName = $("#ChannelName").val();
    var ChannelType = $("#ChannelType").val();
    var ChannelVodserver = $("#ChannelVodserver").val();
    var option = {
        silent: true,
        query: {
            'chl.name': ChannelName,
            'chl.type': ChannelType,
            'chl.vodserver.id': ChannelVodserver,
            pageSize: 20,
            pageNumber: 1
        }
    };
    $("#table_dspd").bootstrapTable("refresh", option);
}

//修改
function updateChannel(index) {
    clearAll();
    $("#table_dspd").bootstrapTable('uncheckAll');
    $("#table_dspd").bootstrapTable('check', index);
    var row = $("#table_dspd").bootstrapTable('getSelections')[0];

    $('#Dialog-Name').val(row.name);
    $('#Dialog-Number').val(row.number);
    $("#Dialog-Type").selectpicker("val", row.type);
    $('#Dialog-Url').val(row.url);
    if ((row.vodserverid) != null) {
        $("#Dialog-Vodserver").selectpicker("val", row.vodserverid);
    }
    $("#btn-ds-opt-confirm").unbind();
    $("#btn-ds-opt-confirm").bind("click", function () {
        modifyChannel(2)
    });
    $("#ds-opt-text-modal-title").html("修改");
    $(".ds-opt-modal-sm").modal("show",{backdrop:'static',keyboard:false});
}

//删除
function deleteChannel(index) {
    $("#table_dspd").bootstrapTable('uncheckAll');
    $("#table_dspd").bootstrapTable('check', index);
    $(".optdialog-delete-modal-sm").modal("show",{backdrop:'static',keyboard:false});
}

/*
* 操作数据
* */
function modifyChannel(mod) {
    var id = null;
    var name = null;
    var number = null;
    var type = null;
    var url = null;
    var vodServer_id = null;

    if (mod == 1) {
        //增加
        name = $('#Dialog-Name').val();
        if (name == null || name == "") {
            CustumCommonUtil.showMsg("请输入名称！");
            return;
        }else if(name.length > 64){
            CustumCommonUtil.showMsg("名称最多为64个字符！");
            return;
        }
        number = $('#Dialog-Number').val();
        if (number == null || number == "") {
            CustumCommonUtil.showMsg("请输入通道编号！");
            return;
        }
        type = $('#Dialog-Type').val();
        url = $('#Dialog-Url').val();
        if (url == null || url == "") {
            CustumCommonUtil.showMsg("请输入视频源地址！");
            return;
        }
        vodServer_id = $('#Dialog-Vodserver').val();
        if (vodServer_id == -1) {
            vodServer_id = null;
        }
    } else if (mod == 2) {
        //修改
        var row = $("#table_dspd").bootstrapTable('getSelections')[0];
        id = row.id;
        name = $('#Dialog-Name').val();
        if (name == null || name == "") {
            CustumCommonUtil.showMsg("请输入名称！");
            return;
        }
        number = $('#Dialog-Number').val();
        if (number == null || number == "") {
            CustumCommonUtil.showMsg("请输入通道编号！");
            return;
        }
        type = $('#Dialog-Type').val();
        url = $('#Dialog-Url').val();
        if (url == null || url == "") {
            CustumCommonUtil.showMsg("请输入视频源地址！");
            return false;
        }
        vodServer_id = $('#Dialog-Vodserver').val();
        if (vodServer_id == -1) {
            vodServer_id = null;
        }
    } else if (mod == 3) {
        //删除
        var row = $("#table_dspd").bootstrapTable('getSelections')[0];
        id = row.id;
    } else {
        CustumCommonUtil.showMsg("操作出错！");
    }
    if (number != null && number != '' && isNaN(number)) {
        CustumCommonUtil.showMsg("请输入正确格式的通道编号");
        return false;
    }
    if (type == 1 || type == 3 || type == 4) {
        if (vodServer_id != null) {
            CustumCommonUtil.showMsg("只有点播才能选择点播服务器!");
            return false;
        }
    }
    var cbSuccess = function (res) {
        $("#table_dspd").bootstrapTable("refresh");
        $(".ds-opt-modal-sm").modal("hide");
        $(".optdialog-delete-modal-sm").modal("hide");
    };
    CommonRemote.xtpz.modifyChannel(mod, id, name, number, type, url, vodServer_id, cbSuccess);
}

//清除所有填空内容
function clearAll() {
    //$('#ChannelName').val('');
    // $('#ChannelType').selectpicker('val', -1);
    // $('#ChannelVodserver').selectpicker('val', -1);
    $('#Dialog-Name').val('');
    $('#Dialog-Number').val('');
    $('#Dialog-Type').selectpicker('val', 1);
    $('#Dialog-Url').val('');
    $('#Dialog-Vodserver').selectpicker('val', -1);
}