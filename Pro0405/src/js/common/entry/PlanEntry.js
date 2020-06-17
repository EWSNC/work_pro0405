/*
* 计划
* */
function PlanEntry(options) {
    this.options = options;
    this.day = options.daynum;
    this.index = options.dayid + "-" + options.index;
    this.isShowOptBtn = options.isShowOptBtn;
    this.optBtnhtml1 = "<div id='icon-edit-" + this.index + "' class='icon-edit icon-modal-edit'></div>" +
        "<div id='icon-del-" + this.index + "' class='icon-del icon-modal-del'></div>" +
        "<div id='icon-copy-" + this.index + "' class='icon-copy icon-modal-copy'></div>";
    this.modalhtml1 = function () {
        var html = "<div   class='plan-item-modal'>" +
            "<div id='icon-add-" + this.index + "' class='icon-add icon-modal-add'></div>";
        if (this.isShowOptBtn) {
            html += this.optBtnhtml1;
        }
        html += "</div>";
        return html;
    };
    this.optBtnhtml2 = "<div id='icon-edit-" + this.index + "' class='icon-edit icon-modal-edit'></div>" +
        "<div id='icon-del-" + this.index + "' class='icon-del icon-modal-del'></div>" +
        "<div id='icon-copy-" + this.index + "' class='icon-copy icon-modal-copy'></div>";
    this.modalhtml2 = function () {
        var html = "<div   class='plan-item-modal'>" +
            "<div id='icon-add-" + this.index + "' class='icon-add icon-modal-add'></div>";
        if (this.isShowOptBtn) {
            html += this.optBtnhtml2;
        }
        html += "</div>";
        return html;
    };
    this.htmlstr = "<div title='" + options.desc + "' class=\"plan-item plan-item-" + this.index + "\">\n" +
        "                        <div class=\"plan-title\"><span class=\"plan-title-text\">" + this.shortOfname(options.desc) + "</span></div>\n" +
        "                        <div class=\"plan-time\"><span class=\"plan-time-text\">" + options.starttime + "-" + options.endtime + "</span></div>\n" +
        "                    </div>\n";
}

//宣教计划页面调用
PlanEntry.prototype.init1 = function (obj, isShowModal) {
    var self_ = this;
    var daybody = $(obj).find(".daybody");
    $(daybody).append(this.htmlstr);
    var selector = ".plan-item-" + this.index;
    if (isShowModal) {
        $(daybody).find(selector).append(this.modalhtml1());
    }
    $(daybody).find(selector).attr("programIndex", self_.options.index);

    $(".plan-item").bind("mouseover", function () {
        $(this).find(".plan-item-modal").show();
    });
    $(".plan-item").bind("mouseout", function () {
        $(this).find(".plan-item-modal").hide();
    });

    //添加
    var addSelector = "#icon-add-" + this.index;
    $(addSelector).bind("click", function () {
        debugger;
        clearDlgData();
        var $checkedObj = $(".jq-jy-active");
        if ($checkedObj.hasClass("jq-item-title")) {//如果有jq-item-title则选中的是监区
            $("#groupId").val($checkedObj.attr("id").replace("jq-item-title", ""));
            roomId = "";
        } else if ($checkedObj.hasClass("jy-item")) {//如果有jy-item则选中的是监室
            groupId = "";
            $("#roomId").val($checkedObj.attr("id").replace("jy-item", ""));
        }
        $("#day").val($(this).parent().parent().parent().parent().find(".daytitle").attr("day"));
        $("#opType").val("1");//操作类型为1 代表添加
        $("#common-modal-title-text").html("添加");
        $(".optdialog-modal-sm").modal("show");
    });
    //编辑
    var editSelector = "#icon-edit-" + this.index;
    $(editSelector).bind("click", function () {
        clearDlgData();
        var $checkedObj = $(".jq-jy-active");
        if ($checkedObj.hasClass("jq-item-title")) {//如果有jq-item-title则选中的是监区
            $("#groupId").val($checkedObj.parent().attr("id").replace("jq-item-", ""));
            roomId = "";
        } else if ($checkedObj.hasClass("jy-item")) {//如果有jy-item则选中的是监室
            groupId = "";
            $("#roomId").val($checkedObj.attr("id").replace("jy-item", ""));
        }
        loadDlgData(self_.options);
        $("#day").val($(this).parent().parent().parent().parent().find(".daytitle").attr("day"));
        $("#opType").val("3");//操作类型为3 代表编辑
        $("#common-modal-title-text").html("编辑");
        $(".optdialog-modal-sm").modal("show");
    });
    //删除
    var deleteSelector = "#icon-del-" + this.index;
    $(deleteSelector).click(function () {
        var mode = $(this).parent().parent().parent().parent().find(".daytitle").attr("mode");
        var day = $(this).parent().parent().parent().parent().find(".daytitle").attr("day");
        var programIndex = $(this).parent().parent().attr("programIndex");
        if (mode == 1) {
            CustumCommonUtil.showMsg("无法删除：此节目计划在宣教模板定义！", "350px","80px");
            return;
        } else if (mode == 4) {
            CustumCommonUtil.showMsg("无法删除：此节目计划由监区指定！", "300px");
            return;
        } else {
            //删除对话框确认按钮
            $("#btn-optdialog-delete-confirm").unbind();
            $("#btn-optdialog-delete-confirm").bind("click", function () {
                var cbSuccess = function (res) {
                    CommonRemote.xjya.loadProgramPlan(initProgramPlan);
                    $(".optdialog-delete-modal-sm").modal("hide");
                };
                CommonRemote.xjya.deleteProgram(groupId, roomId, day, programIndex, cbSuccess);

            });
            $(".optdialog-delete-modal-sm").modal("show");
        }
    });
    //复制
    var copySelector = "#icon-copy-" + this.index;
    $(copySelector).click(function () {
        var mode = $(this).parent().parent().parent().parent().find(".daytitle").attr("mode");
        var day = $(this).parent().parent().parent().parent().find(".daytitle").attr("day");
        var weekday = $(this).parent().parent().parent().parent().find(".daytitle").attr("weekday");
        var programIndex = $(this).parent().parent().attr("programIndex");
        if (mode == 1) {
            CustumCommonUtil.showMsg("无法复制：此节目计划在宣教模板定义！", "350px","80px");
            return;
        } else if (mode == 4) {
            CustumCommonUtil.showMsg("无法复制：此节目计划由监区指定！", "300px");
            return;
        } else {
            showCopyProgramModal(groupId, roomId, day, weekday, programIndex);
        }
    });

}
//宣教模板页面调用
PlanEntry.prototype.init2 = function (obj, isShowModal) {
    var self_ = this;
    var daybody = $(obj).find(".daybody");
    $(daybody).append(this.htmlstr);
    var selector = ".plan-item-" + this.index;
    if (isShowModal) {
        $(daybody).find(selector).append(this.modalhtml2());
    }
    $(daybody).find(selector).attr("programIndex", self_.options.index);

    $(".plan-item").bind("mouseover", function () {
        $(this).find(".plan-item-modal").show();
    });
    $(".plan-item").bind("mouseout", function () {
        $(this).find(".plan-item-modal").hide();
    });

    //添加
    var addSelector = "#icon-add-" + this.index;
    $(addSelector).bind("click", function () {
        clearDlgData();
        var $checkedObj = $(".tmplt-active");
        $("#templateId").val($checkedObj.attr("templateid"));
        $("#weekday").val($(this).parent().parent().parent().parent().find(".daytitle").attr("day"));
        $("#opType").val("1");//操作类型为1 代表添加
        $("#common-modal-title-text").html("添加");
        $(".optdialog-modal-sm").modal("show");
    });
    //编辑
    var editSelector = "#icon-edit-" + this.index;
    $(editSelector).bind("click", function () {
        clearDlgData();
        var $checkedObj = $(".tmplt-active");
        loadDlgData(self_.options);
        $("#templateId").val($checkedObj.attr("templateid"));
        $("#weekday").val($(this).parent().parent().parent().parent().find(".daytitle").attr("day"));
        $("#opType").val("3");//操作类型为3 代表编辑
        $("#common-modal-title-text").html("编辑");
        $(".optdialog-modal-sm").modal("show");
    });
    //删除
    var deleteSelector = "#icon-del-" + this.index;
    $(deleteSelector).click(function () {
        var $checkedObj = $(".tmplt-active");
        var templateid = $checkedObj.attr("templateid");
        var day = $(this).parent().parent().parent().parent().find(".daytitle").attr("day");
        var programIndex = $(this).parent().parent().attr("programIndex");
        //删除对话框确认按钮
        $("#btn-optdialog-delete-confirm").unbind();
        $("#btn-optdialog-delete-confirm").bind("click", function () {
            var cbSuccess = function (res) {
                CommonRemote.xjya.loadTemplate(templateid, initProgramPlan);
            };
            CommonRemote.xjya.deleteTemplateProgram(templateid, day, programIndex, cbSuccess);
            $(".optdialog-delete-modal-sm").modal("hide");
        });
        $(".optdialog-delete-modal-sm").modal("show");
    });
    //复制
    var copySelector = "#icon-copy-" + this.index;
    $(copySelector).click(function () {
        var $checkedObj = $(".tmplt-active");
        var templateid = $checkedObj.attr("templateid")
        var weekday = $(this).parent().parent().parent().parent().find(".daytitle").attr("day");
        var programIndex = $(this).parent().parent().attr("programIndex");
        showCopyProgramModal(templateid, weekday, programIndex);
    });

}
PlanEntry.prototype.shortOfname = function (str) {
    if (str.length > 10) {
        str = str.substring(0, 9) + "...";
    }
    return str;
}