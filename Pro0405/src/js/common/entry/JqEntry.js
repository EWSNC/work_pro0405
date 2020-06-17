/*
* 监区
* */
function JqEntry(options) {
    this.id = options.id;
    this.options = options;
    this.selector = "#jq-item-title" + options.id;
    this.selector2 = "#jq-checkbox-" + options.id;
    this.selector3 = "#jq-item-" + options.id;
    this.isOpen = options.isOpen;
    this.htmlstr = "<div id=\"jq-item-" + options.id + "\" class=\"jq-item\">\n" +
        "                    <div id=\"jq-item-title" + options.id + "\" class=\"jq-item-title\">\n" +
        "                        <div class=\"jq-tips jq-tip" + (this.isOpen ? "-open" : "") + "\"></div>\n" +
        "                        <div class=\"jq-logo\"></div>\n" +
        "                        <div class=\"jq-text\">" + options.name + "</div>\n" +
        "                    </div>\n" +
        "                    <div id=\"jy-item-list-" + options.id + "\" class=\"jy-item-list\">\n" +
        "                    </div>\n" +
        "                </div>";
    this.htmlstr2 = "<div id='tmplt-jq-" + options.id + " ' class=\"jq-item\">\n" +
        "                            <input value='" + options.id + "' id='tmplt-jq-checkbox-" + options.id + "' class=\"jq-checkbox \" type=\"checkbox\"><span class=\"common-text\">" + options.name + "</span>\n" +
        "                        </div>";
    this.htmlstr3 = "<div id='jq-jy-tree-" + options.id + " ' class=\"jq-jy-tree-item\">\n" +
        "                            <div class=\"jq-jy-tree-title\">\n" +
        "                                <input id='jq-checkbox-" + options.id + "' class=\"jq-checkbox\" type=\"checkbox\"><span class=\"common-text\">" + options.name + "</span><span\n" +
        "                                    id='tree-jq-tips-" + options.id + "' class=\"tree-jq-tips jq-tip-open\"></span>\n" +
        "                            </div>\n" +
        "                            <div id='jq-jy-tree-body-" + options.id + "' class=\"jq-body\">\n" +
        "                            </div>\n" +
        "                        </div>";
    this.htmlstr4 = "<div id=\"jq-item-" + options.id + "\" class=\"jq-item\">\n" +
        "                        <div class=\"jq-text\">" + options.name + "</div>\n" +
        "                </div>";
}

//宣教计划页面调用
JqEntry.prototype.init = function () {
    var self_ = this;
    $("#menu-bot").append(self_.htmlstr);
    //点击监区触发
    $(this.selector).bind("click", function () {
        changeSelectCss($(self_.selector));
    });
}
//宣教模板页面  应用对话框调用
JqEntry.prototype.init2 = function () {
    var self_ = this;
    if (self_.isOpen) { //默认打开  则为应用到监室
        $("#jq-jy-area").append(self_.htmlstr3);
        var selector = "#jq-jy-tree-body-" + self_.id;
        var rooms = self_.options.rooms;
        if (null != rooms && rooms.length > 0) {
            for (let i in rooms) {
                var jyObj = new JyEntry(rooms[i]);
                jyObj.init3(selector);
            }
        }
        //点击监区的CheckBox触发
        $(this.selector2).bind("click", function () {
            pickOrdisPickAll(this);
        });
        //点击监区后的图标触发
        var tipselector = "#tree-jq-tips-" + self_.id;
        $(tipselector).bind("click", function () {
            changeSelectCss2(this);
        });
    } else {        //默认不打开则为应用到监区
        $("#jq-jy-area").append(self_.htmlstr2);
    }
}
//监室配置页面调用
JqEntry.prototype.init3 = function () {
    var self_ = this;
    $("#menu-bot").append(self_.htmlstr4);
    $(this.selector3).attr("color", self_.options.color);
    $(this.selector3).attr("name", self_.options.name);
    $(this.selector3).attr("number", self_.options.number);
    $(this.selector3).attr("notes", self_.options.notes);
    //点击监区触发
    $(this.selector3).bind("click", function () {
        changeSelectCss($(self_.selector3));
    });
}