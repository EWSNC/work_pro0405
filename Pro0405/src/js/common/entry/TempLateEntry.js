/*
* 模板
* */
function TempLateEntry(options) {
    this.options = options;
    this.domainid = options.domainid;
    this.id = options.id;
    this.name = options.name;
    this.type = options.type;
    this.applyGroupNumber = options.applyGroupNumber;
    this.applyRoomNumber = options.applyRoomNumber;
    this.selector = "#tmplt-item-" + options.id;
    this.title = "指定应用到[" + options.applyGroupNumber + "]个监区和[" + options.applyRoomNumber + "]个监室";
    this.htmlstr = "<div id=\"tmplt-item-" + options.id + "\" class=\"tmplt-item\">\n" +
        "                        <div class=\"tmplt-text\">" + options.name + "</div>\n" +
        "                        <div title='" + this.title + "' class=\"tmplt-apply-number\">[" + options.applyGroupNumber + "|" + options.applyRoomNumber + "]</div>\n" +
        "                </div>";
}

TempLateEntry.prototype.init = function () {
    //applyGroupNumber
    var self_ = this;
    $("#menu-bot").append(self_.htmlstr);
    $(self_.selector).attr("domainid", self_.domainid);
    $(self_.selector).attr("templateid", self_.id);
    $(self_.selector).attr("templateType", self_.type);
    $(self_.selector).attr("templateName", self_.name);
    $(self_.selector).attr("applyGroupNumber", self_.applyGroupNumber);
    $(self_.selector).attr("applyRoomNumber", self_.applyRoomNumber);

    //点击监区触发
    $(this.selector).bind("click", function () {
        changeSelectCss($(self_.selector));
    });
}

