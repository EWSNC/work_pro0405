/*
* 星期
* */
function DayBoxEntry(options) {

    this.defaluthtmlstr1 = "<ul id='ul_" + options.weekulid + "' class=\"daybox\">\n" +
        "                <li class=\"daytitle\">\n" +
        "                    <div class='title-template'></div>"+
        "                    <div class=\"dayname\"><span class=\"dayname-text\">" + options.weekalias + "</span></div>\n" +
        "                    <div class=\"daynum\">" + options.resultDayTime + "</div>\n" +
        "                </li>\n" +
        "                <li class=\"daybody\">\n" +
        "                </li>\n" +
        "            </ul>";
    this.defaluthtmlstr2 = "<ul id='ul_" + options.weekulid + "' class=\"daybox\">\n" +
        "                <li class=\"daytitle\">\n" +
        "                    <div class=\"dayname\"><span class=\"dayname-text\">" + options.weekalias + "</span></div>\n" +
        "                </li>\n" +
        "                <li class=\"daybody\">\n" +
        "                </li>\n" +
        "            </ul>";
}

//dayPlanObj每天所有的计划
DayBoxEntry.prototype.init1 = function (dayPlanObj, weekObj, isShowModal, weekindex) {
    var dayid = weekObj.weekulid;
    var daynum = weekObj.resultDayTime;
    var weekday = weekindex * 1 + 1;
    var selector = "#ul_" + dayid;
    var mode = dayPlanObj.mode;
    $("#plan-main").append(this.defaluthtmlstr1);
    if (mode == 1 || mode == 4) {
        //1表示应用 模板，4表示与监区保持一致
        var t = dayPlanObj.programTemplate;
        var title = "";
        if (mode == 1) {
            title = t != null ? "已应用模板：" + t.name : "";
        } else {
            title = "执行监区节目计划";
        }
        $(selector).find(".daytitle").find(".title-template").show();
        $(selector).find(".daytitle").attr("title", title);
    } else {

    }

    $(selector).find(".daytitle").attr("day", daynum);
    $(selector).find(".daytitle").attr("mode", mode);
    $(selector).find(".daytitle").attr("weekday", weekday);
    var programObj = jQuery.parseJSON(dayPlanObj.program);
    var isShowOptBtn = false;
    if (null == programObj || programObj.length == 0) {
        new PlanEntry({
            "index": 0,
            "isShowModal": isShowModal,
            "dayid": dayid,
            "daynum": daynum,
            "desc": "沒有节目",
            "starttime": "",
            "endtime": ""
        }).init1($(selector), isShowModal);
    } else {
        isShowOptBtn = true;
        for (let i in programObj) {
            programObj[i].dayid = dayid;
            programObj[i].daynum = daynum;
            programObj[i].isShowOptBtn = isShowOptBtn;
            new PlanEntry(programObj[i]).init1($(selector), isShowModal);
        }
    }

}
//dayPlanObj模板中每天所有的计划
DayBoxEntry.prototype.init2 = function (dayPlanObj, weekObj, isShowModal, weekindex) {
    var dayid = weekObj.weekulid;
    var daynum = weekObj.resultDayTime;
    var weekday = weekindex * 1 + 1;
    var selector = "#ul_" + dayid;
    $("#plan-main").append(this.defaluthtmlstr2);
    $(selector).find(".daytitle").attr("day", weekday);
    var isShowOptBtn = false;

    if (null == dayPlanObj || dayPlanObj.length == 0) {
        new PlanEntry({
            "index": 0,
            "isShowOptBtn": isShowOptBtn,
            "dayid": dayid,
            "daynum": daynum,
            "desc": "沒有节目",
            "starttime": "",
            "endtime": ""
        }).init2($(selector), isShowModal);
    } else {
        isShowOptBtn = true;
        for (let i in dayPlanObj) {
            dayPlanObj[i].dayid = dayid;
            dayPlanObj[i].isShowOptBtn = isShowOptBtn;
            new PlanEntry(dayPlanObj[i]).init2($(selector), isShowModal);
        }
    }

}
