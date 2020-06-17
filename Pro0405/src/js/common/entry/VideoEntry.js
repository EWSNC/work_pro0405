/*
* 视频
* */
function VideoEntry(options) {
    this.id = options.id;
    this.options = options;
    this.selector = "#vodgroup-item-" + options.id;
    this.htmlstr = "<div id=\"vodgroup-item-" + options.id + "\" class=\"vodgroup-item\">\n" +
        "                        <div class=\"vodgroup-text\">" + options.name + "</div>\n" +
        "                </div>";
}

//点播视频页面调用
VideoEntry.prototype.init = function () {
    var self_ = this;
    $("#menu-bot").append(self_.htmlstr);
    $(this.selector).attr("name", self_.options.name);
    $(this.selector).attr("sortValue", self_.options.sortValue);
    $(this.selector).bind("click", function () {
        changeSelectCss($(self_.selector));
    });
}