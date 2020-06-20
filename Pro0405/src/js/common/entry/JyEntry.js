/*
* 监狱
* number 监狱编号
* statuclass 监室状态前端class
* statusalias 监室状态中文
* */
function JyEntry(options) {
    this.options = options;
    //状态转换
    this.convertAlias = function (options) {
        options['statuclass'] = CustumCommonUtil.manualControlRoomStatus[4].CSSname
        options['statusalias'] = CustumCommonUtil.manualControlRoomStatus[4].Alias
    }
    this.convertAlias(options);
    this.selector = "#jycontent_" + options.roomGroupId + "_" + options.id;
    this.selector2 = "#jy-item" + options.id;
    this.selector3 = "#tmplt-jy-item-" + options.id;
    this.number = options.number;
    this.statuclass = options.statuclass;
    this.statusalias = options.statusalias;
    this.htmlstr1 = "<div id='jycontent_" + options.roomGroupId + "_" + options.id + "' title='' class=\" jycontent\">\n" +
        "            <div class=\"jy-name-area\">\n" +
        "                <div class=\"jy-logo\"></div><span class=\"jy-name\">" + options.name + "</span>\n" +
        "            </div>\n" +
        "            <div class=\"jy-status-logo\"><div class=\"" + options.statuclass + "\"></div></div>\n" +
        "            <div class=\"jy-status\"><div class=\"jystatus\">" + options.statusalias + "</div></div>\n" +
        "        </div>";
    this.htmlstr2 = "<div id='jy-item" + options.id + "' class=\"jy-item\">\n" +
        "                            <div>" + options.name + "</div>\n" +
        "                        </div>"
    this.htmlstr3 = "<div class=\"jy-item\">\n" +
        "                                    <div><input id='jy-checkbox-" + options.id + "' value='" + options.id + "' class=\"jy-checkbox\" type=\"checkbox\"><span class=\"common-text\">" + options.name + "</span></div>\n" +
        "                                </div>";
}

//宣教控制页面调用
JyEntry.prototype.init1 = function () {
    $("#xjkzpanelbox").append(this.htmlstr1);
    addRoomStatus(this.options);
    //给监室对象绑定事件
    $(this.selector).bind("click", function () {
        jycontentClick(this);
    })
}
//宣教计划页面调用
JyEntry.prototype.init2 = function (jqobj) {
    var selector = "jy-item-list-" + jqobj.id
    $("#" + selector).append(this.htmlstr2)
    //点击监室触发
    $(this.selector2).bind("click", function () {
        changeSelectCss(this);
    });
}
//宣教模板页面调用  应用对话框   应用到指定监区调用
JyEntry.prototype.init3 = function (selector) {
    $(selector).append(this.htmlstr3)
}

//更新监室状态，只更新状态，不增删改节点。
function updateRoomStatus(groups) {
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var rooms = group.rooms;
        if (rooms != null) {
            for (var j = 0; j < rooms.length; j++) {
                var room = rooms[j];
                addRoomStatus(room);
            }
        }
    }
}

//附加监室状态
function addRoomStatus(room) {
    var selector = "#jycontent_" + room.roomGroupId + "_" + room.id;
    var $jycontent = $(selector);
    var $statulogo = $jycontent.find(".jy-status-logo > div");
    var $uiStatus = $jycontent.find(".jystatus");
    var uiStatus = convertRoomUIStatus(room);
    var tips = uiStatus.tips;
    var cls = uiStatus.cls;
    var statusTxt = uiStatus.statusTxt;
    $jycontent.attr("title", tips);

    if (room.status != 1) {
        //监室有人（1表示监室没人）
        $statulogo.attr("class", cls);
        $uiStatus.html(statusTxt);
    }
}

//组装提示信息：手动控制状态
function convertRoomUIStatus(room) {
    var mcStatus = room.manualControlRoomStatus;
    var insertPlay = mcStatus != null ? mcStatus.insertPlay : null;
    var program = room.program;
    var tips = "监室:" + room.name;
    var cls = "";
    var statusTxt = "";

    var planEnbale = mcStatus != null ? mcStatus.planEnbale : true;
    if (mcStatus != null && mcStatus.valid) {
        tips += "\n    策略：手动控制";
    } else if (planEnbale) {
        tips += "\n    策略：执行预案";
    }
    if (!planEnbale) {
        //禁用预案
        tips += "\n    预案：禁用";
        if (!room.insertPlay) {
            cls = CustumCommonUtil.manualControlRoomStatus[6].CSSname;
            statusTxt = CustumCommonUtil.manualControlRoomStatus[6].Alias;
        }
    }

    if (room.status == 1) {//1表示监室没人
        tips += "\n    " + "监室没人";
        cls = CustumCommonUtil.manualControlRoomStatus[4].CSSname;
        statusTxt = CustumCommonUtil.manualControlRoomStatus[4].Alias;
    } else {
        var currProgramName = null;
        if (room.insertPlay) {
            if (insertPlay.programType == 2) {//2表示点播
                currProgramName = "播放[插播点播]：" + insertPlay.vodResourceName;
                cls = CustumCommonUtil.manualControlRoomStatus[7].CSSname;
                statusTxt = CustumCommonUtil.manualControlRoomStatus[7].Alias;
            } else {
                currProgramName = "播放[插播直播]：" + insertPlay.program;
                cls = CustumCommonUtil.manualControlRoomStatus[7].CSSname;
                statusTxt = CustumCommonUtil.manualControlRoomStatus[7].Alias;
            }
        } else if (program != null) {
            if (program.type == 1) {
                currProgramName = "播放[直播]：" + program.desc;
                cls = CustumCommonUtil.manualControlRoomStatus[8].CSSname;
                statusTxt = CustumCommonUtil.manualControlRoomStatus[8].Alias;
            } else if (program.type == 2) {
                currProgramName = "播放[点播]：" + program.desc;
                cls = CustumCommonUtil.manualControlRoomStatus[9].CSSname;
                statusTxt = CustumCommonUtil.manualControlRoomStatus[9].Alias;
            } else if (program.type == 3) {
                currProgramName = "播放[广播]：" + program.broadcast;
                cls = CustumCommonUtil.manualControlRoomStatus[8].CSSname;
                statusTxt = CustumCommonUtil.manualControlRoomStatus[8].Alias;
            } else {
                currProgramName = "播放：" + program.desc;
                cls = CustumCommonUtil.manualControlRoomStatus[0].CSSname;
                statusTxt = CustumCommonUtil.manualControlRoomStatus[0].Alias;
            }
        }
        if (currProgramName == null) {
            currProgramName = "没有播放";
        }
        tips += "\n    " + currProgramName;
    }


    if (mcStatus != null && mcStatus.valid) {

        var powerDown = false;
        if (mcStatus.powerStatusValue == 1) {
            tips += "\n    电源：开";
            //cls = CustumCommonUtil.manualControlRoomStatus[4].CSSname;
            //statusTxt = CustumCommonUtil.manualControlRoomStatus[4].Alias;
        } else if (mcStatus.powerStatusValue == -1) {
            tips += "\n    电源：关";
            powerDown = true;
            //cls = CustumCommonUtil.manualControlRoomStatus[5].CSSname;
            //statusTxt = CustumCommonUtil.manualControlRoomStatus[5].Alias;
        }


        if (mcStatus.videoCtrlTypeValue == 2) {
            tips += "\n    视频：暂停";
            cls = CustumCommonUtil.manualControlRoomStatus[1].CSSname;
            statusTxt = CustumCommonUtil.manualControlRoomStatus[1].Alias;
        } else if (mcStatus.videoCtrlTypeValue == 3) {
            tips += "\n    视频：静音";
            cls = CustumCommonUtil.manualControlRoomStatus[2].CSSname;
            statusTxt = CustumCommonUtil.manualControlRoomStatus[2].Alias;
        } else if (mcStatus.videoCtrlTypeValue == 4) {
            tips += "\n    视频：停止";
            cls = CustumCommonUtil.manualControlRoomStatus[3].CSSname;
            statusTxt = CustumCommonUtil.manualControlRoomStatus[3].Alias;
        }

        if (mcStatus.volume > 0) {
            tips += "\n    音量： " + mcStatus.volume;
        }

        if (powerDown) {
            cls = CustumCommonUtil.manualControlRoomStatus[5].CSSname;
            statusTxt = CustumCommonUtil.manualControlRoomStatus[5].Alias;
        } else {
            if (!planEnbale && !room.insertPlay) {
                cls = CustumCommonUtil.manualControlRoomStatus[6].CSSname;
                statusTxt = CustumCommonUtil.manualControlRoomStatus[6].Alias;
            }
        }
    }
    return {tips: tips, cls: cls, statusTxt: statusTxt};

}