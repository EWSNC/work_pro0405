var CustumTimeUtil = {
    serverTime: new Date().getTime(),
    getWeek: function (time) {
        var now = '';
        time ? (now = new Date(time)) : (now = new Date());
        var day = now.getDay();
        if (day == 0) {
            day = 7;
        }
        var weekalias = new Array("星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日");
        var weekulid = new Array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
        var week = new Array();
        var nowTime = now.getTime(), MondayTime = nowTime - (day - 1) * 24 * 60 * 60 * 1000;   // 周一
        for (i = 0; i < 7; i++) {
            var daytime = new Date(MondayTime),                   // 格式化周一
                Year = daytime.getFullYear(),
                Month = daytime.getMonth() + 1,
                Day = daytime.getDate();
            if (Month < 10) {
                Month = "0" + Month;
            }
            if (Day < 10) {
                Day = "0" + Day;
            }
            var resultDayTime = Year + '-' + Month + '-' + Day;
            week.push({"resultDayTime": resultDayTime, "weekalias": weekalias[i], "weekulid": weekulid[i]});
            //加一天
            MondayTime += 24 * 60 * 60 * 1000;
        }
        return week;
    },
    compareDayTime: function (time1, time2) {
        var dayTimestr1 = new Date(time1);
        var dayTimestr2 = new Date(time2);
        return new Date(dayTimestr1) < new Date(dayTimestr2);
    },
    showTime: function (selector) {
        var date = new Date();
        date.setTime(this.serverTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        var hh = date.getHours();
        hh = hh < 10 ? "0" + hh : hh;
        var mm = date.getMinutes();
        mm = mm < 10 ? "0" + mm : mm;
        var ss = date.getSeconds();
        ss = ss < 10 ? "0" + ss : ss;
        var str = "服务器时间：" + y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
        $(selector).html(str);
    },
    /**
     * 将时间转为字符串。返回格式：HH:mm:ss
     * 参数：times 单位：秒
     */
    convertTimeIntToString: function (value) {
        var hh = value / 3600;
        hh = Math.floor(hh);
        hh = hh < 10 ? "0" + hh : hh;
        var mm = (value % 3600) / 60;
        mm = Math.floor(mm);
        mm = mm < 10 ? "0" + mm : mm;
        var ss = value % 60;
        ss = Math.floor(ss);
        ss = ss < 10 ? "0" + ss : ss;
        var str = hh + ":" + mm + ":" + ss;
        return str;
    }
}