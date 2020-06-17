//使用示例：
//<input type="text" class="selecttime" readonly value="" id="dtime1"  />
//必须填写input id
//input class必须包含selecttime,可以初始value 如(12:59:10)也可以为空
//插件会自动根据input的位置自动显示在input位置下左下方
$(function () {
    var hours = "", second = "", minites = "";
    for (var i = 0; i < 24; i++) hours += (i == 0 ? "<span class='crently'>" + i + "</span>" : "<span>" + i + "</span>");
    for (var i = 0; i < 60; i++) minites += (i == 0 ? "<span class='crently'>" + i + "</span>" : "<span>" + i + "</span>");
    for (var i = 0; i < 60; i++) second += (i == 0 ? "<span class='crently'>" + i + "</span>" : "<span>" + i + "</span>");
    var str = "<div class='select_time' style='display:none;' >"
        + "	<div class='data'>"
        + "    	<ul id='select_time_hms' style='display: block;'><!--<li class='tit'>时间</li>--><li><input readonly value='00' class='h'>:</li><li><input readonly value='00' class='m'>:</li><li><input readonly value='00' class='s'></li></ul>"
        + "        <div class='box'>"
        + "            <div class='hours sp1 shidden'><div class='tit'>小时<span>×</span></div><p class='clearfix'>" + hours + "</p></div>"
        + "            <div class='hours sp2 shidden'><div class='tit'>分钟<span>×</span></div><p class='clearfix'>" + minites + "</p></div>"
        + "            <div class='hours sp3 shidden'><div class='tit'>秒钟<span>×</span></div><p class='clearfix'>" + second + "</p></div>"
        + "        </div>"
        + "        <div class='select_time_btn'><a class='c'>清空</a><a class='t'>现在</a><a class='o'>确认</a></div>"
        + "    </div>"
        + "</div>";
    $("body").append(str);

    $(".selecttime").click(function () {
        $(".select_time").eq(0).attr("data", $(this).attr("id"));
        /*var objy = $(this).parent().offset().top;
        var objx = $(this).offset().left;
        var objw = $(this).parent().width();
        var objh = $(this).parent().height();*/
        var objy = $(this).offset().top;
        var objx = $(this).offset().left;
        var objw = $(this).width();
        var objh = $(this).height();
        var vcenter = objx + objw / 2;
        var vtop = objy + objh + 15;
        //var vtop = objy + objh + 1;
        var vleft = objx;
        //console.log(objx, objy, objw, objh);
        if ($(this).val() != "") {
            var spt = $(this).val().split(":");
            $(".select_time  #select_time_hms input").eq(0).val(spt[0]);
            $(".select_time  #select_time_hms input").eq(1).val(spt[1]);
            $(".select_time  #select_time_hms input").eq(2).val(spt[2]);
        }
        $(".select_time").css({"top": vtop + "px", "left": vleft + "px", "display": "block"});
    });

    $("#select_time_hms .h").click(function () {
        $(".select_time .box .hours.sp1").show().siblings().hide();
    });
    $("#select_time_hms .m").click(function () {
        $(".select_time .box .hours.sp2").show().siblings().hide();
    });
    $("#select_time_hms .s").click(function () {
        $(".select_time .box .hours.sp3").show().siblings().hide();
    });

    $(".select_time .data li input").click(function () {
        var obj = $(this);
        if ($(this).hasClass("h")) {
            $(".select_time .box .hours.sp1 span").each(function () {
                if ($(this).text() == parseInt($(obj).val())) {
                    $(this).addClass("crently").siblings().removeClass("crently");
                }
            });
        } else if ($(this).hasClass("m")) {
            $(".select_time .box .hours.sp2 span").each(function () {
                if ($(this).text() == parseInt($(obj).val())) {
                    $(this).addClass("crently").siblings().removeClass("crently");
                }
            });
        } else {
            $(".select_time .box .hours.sp3 span").each(function () {
                if ($(this).text() == parseInt($(obj).val())) {
                    $(this).addClass("crently").siblings().removeClass("crently");
                }
            });
        }
    });
    $(".select_time .box .hours .tit span").click(function () {
        $(this).parents(".hours").hide();
    });
    $(".select_time .box .hours p span").click(function () {
        if (!$(this).hasClass("crently")) {
            $(this).addClass("crently").siblings().removeClass("crently");
            if ($(this).parents(".hours").hasClass("sp1")) {
                $("#select_time_hms input.h").val(parseInt($(this).text()) >= 10 ? $(this).text() : "0" + $(this).text());
            } else if ($(this).parents(".hours").hasClass("sp2")) {
                $("#select_time_hms input.m").val(parseInt($(this).text()) >= 10 ? $(this).text() : "0" + $(this).text());
            } else if ($(this).parents(".hours").hasClass("sp3")) {
                $("#select_time_hms input.s").val(parseInt($(this).text()) >= 10 ? $(this).text() : "0" + $(this).text());
            }
            $(this).parents(".hours").hide();
        }
    });
    $(".select_time_btn").on("click", "a", function () {
        if ($(this).hasClass("c")) {
            $("#select_time_hms input.h").val("00");
            $("#select_time_hms input.m").val("00");
            $("#select_time_hms input.s").val("00");
        } else if ($(this).hasClass("t")) {
            var now = new Date();
            var h = now.getHours();
            var m = now.getMinutes();
            var s = now.getSeconds();
            $("#select_time_hms input.h").val(h >= 10 ? h : "0" + h);
            $("#select_time_hms input.m").val(m >= 10 ? m : "0" + m);
            $("#select_time_hms input.s").val(s >= 10 ? s : "0" + s);
        } else if ($(this).hasClass("o")) {
            //console.log($(this).parents(".select_time").attr("data"));
            $("#" + $(this).parents(".select_time").attr("data")).val($("#select_time_hms input.h").val() + ":" + $("#select_time_hms input.m").val() + ":" + $("#select_time_hms input.s").val());
            $(".select_time").hide();
            $(".select_time .box .hours").hide();
        }
    });

    $(document).mouseup(function (e) {
        var _con = $('.select_time');   // 设置目标区域
        if (!$(e.target).hasClass('.selecttime')) {
            if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                $(".select_time").hide();
                $(".select_time .box .hours").hide();
            }
        }
    });
});